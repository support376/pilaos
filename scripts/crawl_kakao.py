from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.crawler import _ensure_windows_policy, run_crawl, seed_initial_grid, status
from src.db import init_db
from src.config import SETTINGS


async def _cmd_seed() -> None:
    await init_db(SETTINGS.db_path)
    n = await seed_initial_grid()
    print(f"[ok] seeded {n} new cells (existing cells kept)")


async def _cmd_run(batch: int) -> None:
    await init_db(SETTINGS.db_path)
    await run_crawl(batch_size=batch)


async def _cmd_status() -> None:
    s = await status()
    print(s)


async def _cmd_smoke() -> None:
    """단일 셀로 실제 API 호출 확인 (강남역 주변)."""
    from src.kakao import KakaoClient

    await init_db(SETTINGS.db_path)
    async with KakaoClient(SETTINGS.kakao_key, rps=SETTINGS.rps) as client:
        res = await client.search_cell(
            SETTINGS.query, lng=127.0276, lat=37.4979, radius=3000
        )
        print(
            f"[smoke] total={res.total_count} pageable={res.pageable_count} "
            f"docs={len(res.documents)} full={res.is_full}"
        )
        for d in res.documents[:5]:
            print(
                f"  - {d.get('place_name')} | {d.get('category_name')} | "
                f"{d.get('road_address_name') or d.get('address_name')}"
            )


def main() -> None:
    _ensure_windows_policy()
    parser = argparse.ArgumentParser(description="Kakao 필라테스 크롤러")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("seed", help="전국 초기 격자 생성")
    run_p = sub.add_parser("run", help="pending 셀 크롤링 실행")
    run_p.add_argument("--batch", type=int, default=100)
    sub.add_parser("status", help="현재 카운트 조회")
    sub.add_parser("smoke", help="강남 1셀로 API 연결 테스트")

    args = parser.parse_args()
    if args.cmd == "seed":
        asyncio.run(_cmd_seed())
    elif args.cmd == "run":
        asyncio.run(_cmd_run(args.batch))
    elif args.cmd == "status":
        asyncio.run(_cmd_status())
    elif args.cmd == "smoke":
        asyncio.run(_cmd_smoke())


if __name__ == "__main__":
    main()
