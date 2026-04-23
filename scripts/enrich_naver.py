from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.crawler import _ensure_windows_policy
from src.enrich import enrich_naver


def main() -> None:
    _ensure_windows_policy()
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", type=int, default=200)
    args = ap.parse_args()
    asyncio.run(enrich_naver(batch_size=args.batch))


if __name__ == "__main__":
    main()
