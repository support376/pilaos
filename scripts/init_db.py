from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.config import SETTINGS
from src.db import init_db


async def main() -> None:
    await init_db(SETTINGS.db_path)
    print(f"[ok] schema ready at {SETTINGS.db_path}")


if __name__ == "__main__":
    asyncio.run(main())
