from __future__ import annotations

import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path

import aiosqlite

SCHEMA = """
CREATE TABLE IF NOT EXISTS pilates_studio (
    kakao_place_id     TEXT PRIMARY KEY,
    place_name         TEXT NOT NULL,
    place_name_norm    TEXT,
    category_name      TEXT,
    phone              TEXT,
    address_name       TEXT,
    road_address_name  TEXT,
    sido               TEXT,
    sigungu            TEXT,
    lng                REAL NOT NULL,
    lat                REAL NOT NULL,
    place_url          TEXT,

    is_pilates         INTEGER,
    pilates_reason     TEXT,

    naver_place_id     TEXT,
    naver_url          TEXT,
    naver_checked_at   TEXT,

    google_place_id    TEXT,
    google_rating      REAL,
    google_review_count INTEGER,
    google_checked_at  TEXT,

    homepage_url       TEXT,
    instagram_handle   TEXT,

    first_seen_at      TEXT NOT NULL,
    last_seen_at       TEXT NOT NULL,
    raw_json           TEXT
);

CREATE INDEX IF NOT EXISTS idx_studio_sigungu     ON pilates_studio(sido, sigungu);
CREATE INDEX IF NOT EXISTS idx_studio_is_pilates  ON pilates_studio(is_pilates);
CREATE INDEX IF NOT EXISTS idx_studio_coord       ON pilates_studio(lng, lat);
CREATE INDEX IF NOT EXISTS idx_studio_name_norm   ON pilates_studio(place_name_norm);

CREATE TABLE IF NOT EXISTS crawl_cell (
    cell_key              TEXT PRIMARY KEY,
    lng                   REAL NOT NULL,
    lat                   REAL NOT NULL,
    radius_m              INTEGER NOT NULL,
    depth                 INTEGER NOT NULL,
    parent_key            TEXT,
    status                TEXT NOT NULL DEFAULT 'pending',
    total_count           INTEGER,
    documents_collected   INTEGER,
    was_full              INTEGER DEFAULT 0,
    children_generated    INTEGER DEFAULT 0,
    retries               INTEGER DEFAULT 0,
    started_at            TEXT,
    completed_at          TEXT,
    error                 TEXT
);

CREATE INDEX IF NOT EXISTS idx_cell_status ON crawl_cell(status);
CREATE INDEX IF NOT EXISTS idx_cell_depth  ON crawl_cell(depth);

CREATE TABLE IF NOT EXISTS crawl_run (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at        TEXT NOT NULL,
    completed_at      TEXT,
    status            TEXT,
    notes             TEXT
);
"""

# 기존 DB에 컬럼·테이블 추가(idempotent). 에러는 이미 존재한다는 의미라 무시.
MIGRATIONS = [
    """CREATE TABLE IF NOT EXISTS waitlist (
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
    )""",
    "CREATE INDEX IF NOT EXISTS idx_waitlist_place ON waitlist(kakao_place_id)",
    "CREATE INDEX IF NOT EXISTS idx_waitlist_phone ON waitlist(phone)",
    "CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status)",
    "ALTER TABLE pilates_studio ADD COLUMN naver_blog_handle TEXT",
    "ALTER TABLE pilates_studio ADD COLUMN kakao_channel_name TEXT",
    "ALTER TABLE pilates_studio ADD COLUMN kakao_channel_url TEXT",
    "ALTER TABLE pilates_studio ADD COLUMN kakao_review_count INTEGER",
    "ALTER TABLE pilates_studio ADD COLUMN kakao_review_score REAL",
    "ALTER TABLE pilates_studio ADD COLUMN kakao_photo_count INTEGER",
    "ALTER TABLE pilates_studio ADD COLUMN blog_review_count INTEGER",
    "ALTER TABLE pilates_studio ADD COLUMN blog_review_urls TEXT",
    "ALTER TABLE pilates_studio ADD COLUMN menu_count INTEGER",
    "ALTER TABLE pilates_studio ADD COLUMN menu_price_min INTEGER",
    "ALTER TABLE pilates_studio ADD COLUMN menu_price_max INTEGER",
    "ALTER TABLE pilates_studio ADD COLUMN has_coupon INTEGER",
    "ALTER TABLE pilates_studio ADD COLUMN open_hours_raw TEXT",
    "ALTER TABLE pilates_studio ADD COLUMN kakao_detail_checked_at TEXT",
    "ALTER TABLE pilates_studio ADD COLUMN kakao_detail_raw TEXT",
]


def utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


async def init_db(db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    async with aiosqlite.connect(db_path) as db:
        await db.executescript(SCHEMA)
        await db.execute("PRAGMA journal_mode=WAL;")
        await db.execute("PRAGMA synchronous=NORMAL;")
        await db.execute("PRAGMA busy_timeout = 60000;")
        for stmt in MIGRATIONS:
            try:
                await db.execute(stmt)
                await db.commit()
            except aiosqlite.OperationalError as e:
                msg = str(e).lower()
                if "duplicate column" in msg:
                    continue
                # 락/경합은 재시도
                for _ in range(5):
                    await asyncio.sleep(1.0)
                    try:
                        await db.execute(stmt)
                        await db.commit()
                        break
                    except aiosqlite.OperationalError as e2:
                        if "duplicate column" in str(e2).lower():
                            break


async def connect(db_path: Path) -> aiosqlite.Connection:
    db = await aiosqlite.connect(db_path, timeout=60)
    await db.execute("PRAGMA journal_mode=WAL;")
    await db.execute("PRAGMA synchronous=NORMAL;")
    await db.execute("PRAGMA foreign_keys=ON;")
    await db.execute("PRAGMA busy_timeout = 60000;")
    db.row_factory = aiosqlite.Row
    return db


async def upsert_studio(
    db: aiosqlite.Connection,
    doc: dict,
    *,
    is_pilates: int | None,
    reason: str,
    name_norm: str,
    sido: str | None,
    sigungu: str | None,
) -> None:
    now = utcnow_iso()
    params = {
        "kakao_place_id": str(doc["id"]),
        "place_name": doc.get("place_name", ""),
        "place_name_norm": name_norm,
        "category_name": doc.get("category_name"),
        "phone": doc.get("phone") or None,
        "address_name": doc.get("address_name") or None,
        "road_address_name": doc.get("road_address_name") or None,
        "sido": sido,
        "sigungu": sigungu,
        "lng": float(doc["x"]),
        "lat": float(doc["y"]),
        "place_url": doc.get("place_url"),
        "is_pilates": is_pilates,
        "pilates_reason": reason,
        "first_seen_at": now,
        "last_seen_at": now,
        "raw_json": json.dumps(doc, ensure_ascii=False),
    }
    await db.execute(
        """
        INSERT INTO pilates_studio (
            kakao_place_id, place_name, place_name_norm, category_name,
            phone, address_name, road_address_name, sido, sigungu,
            lng, lat, place_url, is_pilates, pilates_reason,
            first_seen_at, last_seen_at, raw_json
        ) VALUES (
            :kakao_place_id, :place_name, :place_name_norm, :category_name,
            :phone, :address_name, :road_address_name, :sido, :sigungu,
            :lng, :lat, :place_url, :is_pilates, :pilates_reason,
            :first_seen_at, :last_seen_at, :raw_json
        )
        ON CONFLICT(kakao_place_id) DO UPDATE SET
            place_name        = excluded.place_name,
            place_name_norm   = excluded.place_name_norm,
            category_name     = excluded.category_name,
            phone             = excluded.phone,
            address_name      = excluded.address_name,
            road_address_name = excluded.road_address_name,
            sido              = excluded.sido,
            sigungu           = excluded.sigungu,
            lng               = excluded.lng,
            lat               = excluded.lat,
            place_url         = excluded.place_url,
            is_pilates        = excluded.is_pilates,
            pilates_reason    = excluded.pilates_reason,
            last_seen_at      = excluded.last_seen_at,
            raw_json          = excluded.raw_json;
        """,
        params,
    )


async def cell_exists(db: aiosqlite.Connection, cell_key: str) -> bool:
    async with db.execute(
        "SELECT 1 FROM crawl_cell WHERE cell_key = ?", (cell_key,)
    ) as cur:
        return await cur.fetchone() is not None


async def insert_cell(
    db: aiosqlite.Connection,
    *,
    cell_key: str,
    lng: float,
    lat: float,
    radius_m: int,
    depth: int,
    parent_key: str | None,
) -> bool:
    try:
        await db.execute(
            """
            INSERT INTO crawl_cell (cell_key, lng, lat, radius_m, depth, parent_key, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
            """,
            (cell_key, lng, lat, radius_m, depth, parent_key),
        )
        return True
    except aiosqlite.IntegrityError:
        return False


async def claim_pending_cells(
    db: aiosqlite.Connection, limit: int
) -> list[aiosqlite.Row]:
    async with db.execute(
        """
        SELECT cell_key, lng, lat, radius_m, depth
          FROM crawl_cell
         WHERE status = 'pending'
      ORDER BY depth ASC, cell_key
         LIMIT ?
        """,
        (limit,),
    ) as cur:
        return await cur.fetchall()


async def mark_cell_running(db: aiosqlite.Connection, cell_key: str) -> None:
    await db.execute(
        "UPDATE crawl_cell SET status='running', started_at=? WHERE cell_key=?",
        (utcnow_iso(), cell_key),
    )


async def mark_cell_done(
    db: aiosqlite.Connection,
    cell_key: str,
    *,
    total_count: int,
    documents_collected: int,
    was_full: bool,
    children_generated: int,
) -> None:
    await db.execute(
        """
        UPDATE crawl_cell
           SET status='done', completed_at=?, total_count=?,
               documents_collected=?, was_full=?, children_generated=?
         WHERE cell_key=?
        """,
        (
            utcnow_iso(),
            total_count,
            documents_collected,
            1 if was_full else 0,
            children_generated,
            cell_key,
        ),
    )


async def mark_cell_error(
    db: aiosqlite.Connection, cell_key: str, error: str
) -> None:
    await db.execute(
        """
        UPDATE crawl_cell
           SET status='error', completed_at=?, error=?, retries=retries+1
         WHERE cell_key=?
        """,
        (utcnow_iso(), error[:500], cell_key),
    )


async def counts(db: aiosqlite.Connection) -> dict:
    out: dict = {}
    async with db.execute(
        "SELECT status, COUNT(*) FROM crawl_cell GROUP BY status"
    ) as cur:
        out["cells"] = {row[0]: row[1] for row in await cur.fetchall()}
    async with db.execute(
        "SELECT COUNT(*) FROM pilates_studio"
    ) as cur:
        row = await cur.fetchone()
        out["studios_total"] = row[0] if row else 0
    async with db.execute(
        "SELECT COUNT(*) FROM pilates_studio WHERE is_pilates=1"
    ) as cur:
        row = await cur.fetchone()
        out["studios_pilates"] = row[0] if row else 0
    return out
