from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")


@dataclass(frozen=True)
class Settings:
    kakao_key: str
    naver_client_id: str
    naver_client_secret: str
    google_key: str

    db_path: Path

    query: str
    initial_radius_m: int
    grid_step_deg: float
    max_depth: int
    concurrency: int
    rps: int


def _env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def load_settings() -> Settings:
    db_path = ROOT / _env("DB_PATH", "data/pilates.db")
    db_path.parent.mkdir(parents=True, exist_ok=True)

    return Settings(
        kakao_key=_env("KAKAO_REST_API_KEY"),
        naver_client_id=_env("NAVER_CLIENT_ID"),
        naver_client_secret=_env("NAVER_CLIENT_SECRET"),
        google_key=_env("GOOGLE_MAPS_API_KEY"),
        db_path=db_path,
        query=_env("CRAWL_QUERY", "필라테스"),
        initial_radius_m=int(_env("CRAWL_INITIAL_RADIUS_M", "15000")),
        grid_step_deg=float(_env("CRAWL_GRID_STEP_DEG", "0.2")),
        max_depth=int(_env("CRAWL_MAX_DEPTH", "5")),
        concurrency=int(_env("CRAWL_CONCURRENCY", "4")),
        rps=int(_env("CRAWL_RPS", "8")),
    )


SETTINGS = load_settings()
