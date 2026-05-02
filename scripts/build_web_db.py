"""운영 DB → Vercel 배포용 슬림 SQLite 생성.

원본의 raw_json·kakao_detail_raw 등 대용량 컬럼을 제외하고
웹에서 필요한 필드만 복사. 대략 277MB → ~15MB.
"""

from __future__ import annotations

import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "pilates.db"
DST = ROOT / "web" / "data" / "pilates.db"

SLIM_COLS = [
    "kakao_place_id",
    "place_name",
    "place_name_norm",
    "category_name",
    "phone",
    "address_name",
    "road_address_name",
    "sido",
    "sigungu",
    "lng",
    "lat",
    "place_url",
    "is_pilates",
    "pilates_reason",
    "naver_place_id",
    "naver_url",
    "google_place_id",
    "google_rating",
    "google_review_count",
    "homepage_url",
    "instagram_handle",
    "naver_blog_handle",
    "kakao_channel_name",
    "kakao_channel_url",
    "kakao_review_count",
    "kakao_review_score",
    "kakao_photo_count",
    "blog_review_count",
    "menu_count",
    "menu_price_min",
    "menu_price_max",
    "has_coupon",
    "first_seen_at",
    "last_seen_at",
    "photo_urls",
    "photo_main",
    "photo_count_real",
    "industry",
]


def build() -> None:
    if not SRC.exists():
        print(f"[err] source not found: {SRC}")
        sys.exit(1)

    DST.parent.mkdir(parents=True, exist_ok=True)
    if DST.exists():
        DST.unlink()

    src = sqlite3.connect(str(SRC))
    dst = sqlite3.connect(str(DST))

    # is_pilates=1만 복사 (오염 레코드 제외)
    dst.execute(
        f"""
        CREATE TABLE pilates_studio (
            {", ".join(f"{c} {_coltype(c)}" for c in SLIM_COLS)},
            PRIMARY KEY (kakao_place_id)
        )
        """
    )
    dst.execute(
        "CREATE INDEX idx_studio_sigungu     ON pilates_studio(sido, sigungu)"
    )
    dst.execute(
        "CREATE INDEX idx_studio_is_pilates  ON pilates_studio(is_pilates)"
    )
    dst.execute(
        "CREATE INDEX idx_studio_coord       ON pilates_studio(lng, lat)"
    )
    dst.execute(
        "CREATE INDEX idx_studio_name_norm   ON pilates_studio(place_name_norm)"
    )

    placeholders = ", ".join("?" * len(SLIM_COLS))
    cols_str = ", ".join(SLIM_COLS)

    rows = src.execute(
        f"SELECT {cols_str} FROM pilates_studio WHERE is_pilates = 1"
    ).fetchall()
    dst.executemany(
        f"INSERT INTO pilates_studio ({cols_str}) VALUES ({placeholders})",
        rows,
    )

    # waitlist 테이블 — 로컬 개발용으로만 유지 (Vercel에서는 Supabase 사용)
    dst.execute(
        """
        CREATE TABLE waitlist (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            kakao_place_id  TEXT NOT NULL,
            place_name      TEXT,
            biz_number      TEXT,
            owner_name      TEXT,
            phone           TEXT NOT NULL,
            message         TEXT,
            source_url      TEXT,
            user_agent      TEXT,
            ip              TEXT,
            status          TEXT DEFAULT 'new',
            created_at      TEXT NOT NULL
        )
        """
    )
    dst.execute("CREATE INDEX idx_waitlist_place ON waitlist(kakao_place_id)")
    dst.execute("CREATE INDEX idx_waitlist_phone ON waitlist(phone)")
    dst.execute("CREATE INDEX idx_waitlist_status ON waitlist(status)")

    dst.commit()
    dst.execute("VACUUM")
    dst.commit()
    dst.close()
    src.close()

    size_mb = DST.stat().st_size / (1024 * 1024)
    print(f"[ok] slim DB: {DST} ({len(rows):,} rows, {size_mb:.1f} MB)")


def _coltype(col: str) -> str:
    int_cols = {
        "is_pilates",
        "kakao_review_count",
        "kakao_photo_count",
        "blog_review_count",
        "menu_count",
        "menu_price_min",
        "menu_price_max",
        "has_coupon",
        "google_review_count",
        "photo_count_real",
    }
    real_cols = {"lng", "lat", "kakao_review_score", "google_rating"}
    if col in int_cols:
        return "INTEGER"
    if col in real_cols:
        return "REAL"
    return "TEXT"


if __name__ == "__main__":
    build()
