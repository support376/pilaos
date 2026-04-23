from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src import db as dbmod
from src.config import SETTINGS
from src.crawler import _ensure_windows_policy


async def _summary() -> None:
    conn = await dbmod.connect(SETTINGS.db_path)
    try:
        async with conn.execute(
            """
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN is_pilates=1 THEN 1 ELSE 0 END) AS pilates,
                SUM(CASE WHEN naver_url IS NOT NULL THEN 1 ELSE 0 END) AS naver_ok,
                SUM(CASE WHEN google_place_id IS NOT NULL THEN 1 ELSE 0 END) AS google_ok,
                SUM(CASE WHEN homepage_url IS NOT NULL THEN 1 ELSE 0 END) AS homepage_ok,
                SUM(CASE WHEN instagram_handle IS NOT NULL THEN 1 ELSE 0 END) AS insta_ok,
                SUM(CASE WHEN naver_blog_handle IS NOT NULL THEN 1 ELSE 0 END) AS blog_ok,
                SUM(CASE WHEN kakao_channel_name IS NOT NULL THEN 1 ELSE 0 END) AS channel_ok,
                SUM(CASE WHEN kakao_review_count > 0 THEN 1 ELSE 0 END) AS kmap_reviewed,
                SUM(CASE WHEN blog_review_count > 0 THEN 1 ELSE 0 END) AS blog_reviewed,
                SUM(CASE WHEN has_coupon=1 THEN 1 ELSE 0 END) AS coupon_ok,
                SUM(CASE WHEN menu_count > 0 THEN 1 ELSE 0 END) AS menu_ok,
                SUM(CASE WHEN kakao_detail_checked_at IS NOT NULL THEN 1 ELSE 0 END) AS detail_checked
              FROM pilates_studio
             WHERE is_pilates = 1
            """
        ) as cur:
            row = await cur.fetchone()

        total = row["pilates"] or 1
        def pct(n): return f"{n}/{total} ({100*n/total:.1f}%)"
        print("=== 전국 필라테스 디지털 자산 현황 ===")
        print(f"  필라테스 판정 총 : {row['pilates']}")
        print(f"  카카오 상세 완료 : {pct(row['detail_checked'])}")
        print()
        print("  [플랫폼 등록]")
        print(f"    네이버         : {pct(row['naver_ok'])}")
        print(f"    구글           : {pct(row['google_ok'])}")
        print(f"    카카오톡 채널  : {pct(row['channel_ok'])}")
        print()
        print("  [디지털 자산]")
        print(f"    홈페이지 보유  : {pct(row['homepage_ok'])}")
        print(f"    인스타그램     : {pct(row['insta_ok'])}")
        print(f"    네이버 블로그  : {pct(row['blog_ok'])}")
        print()
        print("  [리뷰·콘텐츠]")
        print(f"    카카오맵 리뷰 > 0 : {pct(row['kmap_reviewed'])}")
        print(f"    블로그 리뷰  > 0  : {pct(row['blog_reviewed'])}")
        print(f"    메뉴 등록       : {pct(row['menu_ok'])}")
        print(f"    쿠폰 운영       : {pct(row['coupon_ok'])}")

        print("\n=== 시도별 ===")
        async with conn.execute(
            """
            SELECT sido, COUNT(*) AS n
              FROM pilates_studio
             WHERE is_pilates = 1 AND sido IS NOT NULL
             GROUP BY sido
             ORDER BY n DESC
            """
        ) as cur:
            rows = await cur.fetchall()
        for r in rows:
            print(f"  {r['sido']:6s}  {r['n']}")
    finally:
        await conn.close()


async def _list(region: str | None, limit: int) -> None:
    conn = await dbmod.connect(SETTINGS.db_path)
    try:
        where = ["is_pilates = 1"]
        params: list = []
        if region:
            where.append("(sido LIKE ? OR sigungu LIKE ?)")
            like = f"%{region}%"
            params.extend([like, like])
        q = f"""
            SELECT place_name, sido, sigungu,
                   CASE WHEN naver_url IS NOT NULL THEN 'O' ELSE '.' END AS n,
                   CASE WHEN kakao_channel_name IS NOT NULL THEN 'O' ELSE '.' END AS k,
                   CASE WHEN homepage_url IS NOT NULL THEN 'O' ELSE '.' END AS h,
                   CASE WHEN instagram_handle IS NOT NULL THEN 'O' ELSE '.' END AS i,
                   CASE WHEN naver_blog_handle IS NOT NULL THEN 'O' ELSE '.' END AS b,
                   kakao_review_count AS kmap_rv,
                   kakao_review_score AS kmap_sc,
                   blog_review_count AS blog_rv,
                   menu_count AS menu_n
              FROM pilates_studio
             WHERE {" AND ".join(where)}
          ORDER BY (COALESCE(kakao_review_count,0)+COALESCE(blog_review_count,0)) DESC,
                   place_name
             LIMIT ?
        """
        params.append(limit)
        async with conn.execute(q, params) as cur:
            rows = await cur.fetchall()
        print(f"{'상호':28s} {'시군구':8s} N K H I B  {'K리뷰':>6s} {'K점수':>4s} {'블로그':>5s} {'메뉴':>4s}")
        print("-" * 85)
        for r in rows:
            name = (r["place_name"] or "")[:26]
            kr = r["kmap_rv"] if r["kmap_rv"] is not None else "-"
            ks = f"{r['kmap_sc']:.1f}" if r["kmap_sc"] else "-"
            br = r["blog_rv"] if r["blog_rv"] is not None else "-"
            mn = r["menu_n"] if r["menu_n"] is not None else "-"
            print(
                f"{name:28s} {(r['sigungu'] or '-')[:8]:8s} "
                f"{r['n']} {r['k']} {r['h']} {r['i']} {r['b']}  "
                f"{str(kr):>6s} {ks:>4s} {str(br):>5s} {str(mn):>4s}"
            )
    finally:
        await conn.close()


async def _check(needle: str) -> None:
    conn = await dbmod.connect(SETTINGS.db_path)
    try:
        async with conn.execute(
            """
            SELECT place_name, category_name, is_pilates, pilates_reason,
                   road_address_name, phone, naver_url, google_rating
              FROM pilates_studio
             WHERE place_name LIKE ? OR place_name_norm LIKE ?
             LIMIT 50
            """,
            (f"%{needle}%", f"%{needle}%"),
        ) as cur:
            rows = await cur.fetchall()
        for r in rows:
            mark = "O" if r["is_pilates"] else "x"
            print(f"[{mark}] {r['place_name']} | {r['category_name']} | {r['pilates_reason']}")
            print(f"     {r['road_address_name'] or '-'} | {r['phone'] or '-'}")
            if r["naver_url"]:
                print(f"     naver: {r['naver_url']}")
    finally:
        await conn.close()


def main() -> None:
    _ensure_windows_policy()
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("summary")
    l = sub.add_parser("list")
    l.add_argument("--region", default=None, help="시도/시군구 검색어")
    l.add_argument("--limit", type=int, default=30)
    c = sub.add_parser("check")
    c.add_argument("needle", help="상호 검색어")
    args = ap.parse_args()

    if args.cmd == "summary":
        asyncio.run(_summary())
    elif args.cmd == "list":
        asyncio.run(_list(args.region, args.limit))
    elif args.cmd == "check":
        asyncio.run(_check(args.needle))


if __name__ == "__main__":
    main()
