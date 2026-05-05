#!/usr/bin/env python3
"""
네이버 블로그 크롤러 v1
- 매물별로 '학원명 + 시군구' 검색 → 블로그 후기 카운트 + 최근 6개월 글 + top 3 글 저장
- 네이버 검색 API 사용 (일 25,000건 한도)
- 사용 전: developers.naver.com 에서 검색 API 앱 등록 후
  .env 또는 환경변수에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET 설정

사용법:
  export NAVER_CLIENT_ID=xxx
  export NAVER_CLIENT_SECRET=xxx
  python3 scripts/enrich_naver_blog.py

옵션:
  --limit N    상위 N개 매물만 (테스트용)
  --since-days D   D일 이내 last_crawled 갱신만 skip (기본 30)
  --sleep S    요청 간 대기 (초, 기본 0.4)
"""
import os
import sys
import time
import json
import sqlite3
import argparse
from datetime import datetime, timedelta
from urllib import request, parse, error
from pathlib import Path

DB = Path(__file__).resolve().parent.parent / "web" / "data" / "pilates.db"
API_URL = "https://openapi.naver.com/v1/search/blog.json"


def ensure_schema(con: sqlite3.Connection) -> None:
    """필요한 컬럼이 없으면 추가 (멱등)."""
    cols = {r[1] for r in con.execute("PRAGMA table_info(pilates_studio)")}
    adds = [
        ("blog_review_count_v2", "INTEGER"),
        ("blog_recent_count", "INTEGER"),
        ("blog_recent_posts", "TEXT"),
        ("blog_last_crawled_at", "TEXT"),
    ]
    for name, t in adds:
        if name not in cols:
            con.execute(f"ALTER TABLE pilates_studio ADD COLUMN {name} {t}")
            print(f"[SCHEMA] +{name}")
    con.commit()


def naver_search(query: str, client_id: str, client_secret: str, display: int = 30) -> dict | None:
    qs = parse.urlencode({"query": query, "display": display, "sort": "date"})
    req = request.Request(
        f"{API_URL}?{qs}",
        headers={"X-Naver-Client-Id": client_id, "X-Naver-Client-Secret": client_secret},
    )
    try:
        with request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as e:
        body = e.read().decode("utf-8", "ignore")[:200]
        print(f"  [HTTP {e.code}] {query}: {body}")
        if e.code == 401:
            print()
            print("  ⚠ 인증 실패 — 다음 중 하나 확인하세요:")
            print("    1) developers.naver.com → 내 애플리케이션 → API 설정 → '검색' 체크")
            print("    2) Client ID/Secret 복사 시 공백·따옴표 포함되지 않았는지")
            print("    3) 환경변수가 현재 PowerShell 세션에 실제로 설정됐는지")
            print()
            print("  해결 후 다시 실행하세요. 추가 401 방지 위해 종료합니다.")
            sys.exit(1)
        return None
    except Exception as e:
        print(f"  [ERR] {query}: {e}")
        return None


def parse_postdate(s: str) -> datetime | None:
    try:
        return datetime.strptime(s, "%Y%m%d")
    except Exception:
        return None


def strip_tags(s: str) -> str:
    return s.replace("<b>", "").replace("</b>", "").replace("&quot;", '"').replace("&amp;", "&")


def load_dotenv() -> None:
    """레포 루트의 .env 파일을 환경변수로 로드 (있으면)."""
    for cand in [
        Path(__file__).resolve().parent.parent / ".env",
        Path(__file__).resolve().parent / ".env",
    ]:
        if not cand.exists():
            continue
        for line in cand.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k, v = k.strip(), v.strip().strip('"').strip("'")
            if k and v and k not in os.environ:
                os.environ[k] = v
        print(f"[ENV] .env loaded from {cand}")
        break


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="0 = no limit")
    ap.add_argument("--since-days", type=int, default=30)
    ap.add_argument("--sleep", type=float, default=0.4)
    ap.add_argument("--only-empty", action="store_true", help="아직 크롤 안된 row만")
    args = ap.parse_args()

    load_dotenv()

    cid = (os.environ.get("NAVER_CLIENT_ID") or "").strip()
    csec = (os.environ.get("NAVER_CLIENT_SECRET") or "").strip()
    if not cid or not csec:
        print("[ERR] NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 가 비어있습니다.")
        print()
        print("  방법 1 — .env 파일 (권장):")
        print("    레포 루트(C:\\Users\\user\\Documents\\Claude\\Projects\\PilaOS\\pilaos\\.env)에 다음 두 줄:")
        print("      NAVER_CLIENT_ID=받은아이디")
        print("      NAVER_CLIENT_SECRET=받은시크릿")
        print()
        print("  방법 2 — PowerShell 환경변수 (현재 세션):")
        print("    $env:NAVER_CLIENT_ID = \"받은아이디\"")
        print("    $env:NAVER_CLIENT_SECRET = \"받은시크릿\"")
        sys.exit(1)
    print(f"[ENV] NAVER_CLIENT_ID = {cid[:6]}...{cid[-3:]} (길이 {len(cid)})")
    print(f"[ENV] NAVER_CLIENT_SECRET = {csec[:4]}... (길이 {len(csec)})")
    print()

    if not DB.exists():
        print(f"[ERR] DB 없음: {DB}")
        sys.exit(1)

    con = sqlite3.connect(str(DB))
    con.row_factory = sqlite3.Row
    ensure_schema(con)

    where = []
    where.append("place_name IS NOT NULL")
    where.append("sigungu IS NOT NULL")
    if args.only_empty:
        where.append("(blog_last_crawled_at IS NULL)")
    else:
        cutoff = (datetime.now() - timedelta(days=args.since_days)).isoformat()
        where.append(f"(blog_last_crawled_at IS NULL OR blog_last_crawled_at < '{cutoff}')")
    sql = f"SELECT rowid, place_name, sigungu FROM pilates_studio WHERE {' AND '.join(where)}"
    if args.limit > 0:
        sql += f" LIMIT {args.limit}"

    rows = list(con.execute(sql))
    print(f"=== 대상: {len(rows):,} row ===")
    print(f"  API 한도: 일 25,000건 / 초당 10건")
    print(f"  대기: {args.sleep}초/건 → 예상 {len(rows) * args.sleep / 60:.1f}분\n")

    six_months_ago = datetime.now() - timedelta(days=180)
    updated = 0
    for i, r in enumerate(rows, start=1):
        query = f"{r['place_name']} {r['sigungu']}"
        resp = naver_search(query, cid, csec, display=30)
        if resp is None:
            time.sleep(args.sleep)
            continue

        items = resp.get("items", [])
        total_count = resp.get("total", 0)

        # 최근 6개월 카운트 + top 3
        recent_count = 0
        top_posts = []
        seen_blogger = set()
        for it in items:
            pd = parse_postdate(it.get("postdate", ""))
            if pd and pd >= six_months_ago:
                recent_count += 1
            blogger = it.get("bloggername", "")
            if blogger in seen_blogger:
                continue
            seen_blogger.add(blogger)
            if len(top_posts) < 3:
                top_posts.append({
                    "title": strip_tags(it.get("title", "")),
                    "url": it.get("link", ""),
                    "blogger": blogger,
                    "date": it.get("postdate", ""),
                })

        con.execute(
            "UPDATE pilates_studio SET blog_review_count_v2=?, blog_recent_count=?, blog_recent_posts=?, blog_last_crawled_at=? WHERE rowid=?",
            (total_count, recent_count, json.dumps(top_posts, ensure_ascii=False), datetime.now().isoformat(timespec="seconds"), r["rowid"])
        )
        updated += 1
        if updated % 50 == 0:
            con.commit()
            print(f"  [{i:>5}/{len(rows)}] {r['place_name']:<20s} {r['sigungu']:<8s}  total={total_count:<5}  recent={recent_count}")

        time.sleep(args.sleep)

    con.commit()
    print(f"\n=== 완료: {updated:,} row 업데이트 ===")


if __name__ == "__main__":
    main()
