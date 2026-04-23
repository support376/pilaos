from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.config import SETTINGS
from src.crawler import _ensure_windows_policy
from src.db import init_db
from src.enrich import enrich_kakao_detail


async def _main(batch: int) -> None:
    await init_db(SETTINGS.db_path)
    await enrich_kakao_detail(batch_size=batch)


def main() -> None:
    _ensure_windows_policy()
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", type=int, default=300)
    args = ap.parse_args()
    asyncio.run(_main(args.batch))


if __name__ == "__main__":
    main()
