from __future__ import annotations

import asyncio
import json
import time
from dataclasses import dataclass

import aiosqlite

from . import db as dbmod
from .config import SETTINGS
from .google import GoogleClient, GoogleItem
from .kakao_detail import KakaoDetail, KakaoDetailClient
from .matching import best_match
from .naver import NaverClient, NaverItem

MIN_CONFIDENCE = 0.65


@dataclass
class EnrichStats:
    checked: int = 0
    matched: int = 0
    no_result: int = 0
    errors: int = 0


async def _studios_needing_naver(
    db: aiosqlite.Connection, limit: int
) -> list[aiosqlite.Row]:
    async with db.execute(
        """
        SELECT kakao_place_id, place_name, road_address_name, address_name,
               phone, lng, lat, sido, sigungu
          FROM pilates_studio
         WHERE is_pilates = 1 AND naver_checked_at IS NULL
      ORDER BY kakao_place_id
         LIMIT ?
        """,
        (limit,),
    ) as cur:
        return await cur.fetchall()


async def _studios_needing_google(
    db: aiosqlite.Connection, limit: int
) -> list[aiosqlite.Row]:
    async with db.execute(
        """
        SELECT kakao_place_id, place_name, road_address_name, address_name,
               phone, lng, lat, sido, sigungu
          FROM pilates_studio
         WHERE is_pilates = 1 AND google_checked_at IS NULL
      ORDER BY kakao_place_id
         LIMIT ?
        """,
        (limit,),
    ) as cur:
        return await cur.fetchall()


def _naver_query(row: aiosqlite.Row) -> str:
    parts = [row["place_name"]]
    if row["sigungu"]:
        parts.append(row["sigungu"])
    elif row["sido"]:
        parts.append(row["sido"])
    return " ".join(p for p in parts if p)


def _google_query(row: aiosqlite.Row) -> str:
    parts = [row["place_name"]]
    if row["sigungu"]:
        parts.append(row["sigungu"])
    parts.append("필라테스")
    return " ".join(p for p in parts if p)


def _naver_to_candidate(it: NaverItem) -> dict:
    return {
        "name": it.title,
        "address": it.road_address or it.address,
        "phone": it.phone,
        "lng": it.lng,
        "lat": it.lat,
        "_raw": it,
    }


def _google_to_candidate(it: GoogleItem) -> dict:
    return {
        "name": it.name,
        "address": it.address,
        "phone": it.phone or "",
        "lng": it.lng,
        "lat": it.lat,
        "_raw": it,
    }


async def _enrich_one_naver(
    db: aiosqlite.Connection,
    client: NaverClient,
    row: aiosqlite.Row,
    stats: EnrichStats,
) -> None:
    q = _naver_query(row)
    now = dbmod.utcnow_iso()
    try:
        items = await client.search_local(q)
    except Exception as e:  # noqa: BLE001
        stats.errors += 1
        await db.execute(
            "UPDATE pilates_studio SET naver_checked_at=? WHERE kakao_place_id=?",
            (now, row["kakao_place_id"]),
        )
        return

    stats.checked += 1
    if not items:
        stats.no_result += 1
        await db.execute(
            "UPDATE pilates_studio SET naver_checked_at=? WHERE kakao_place_id=?",
            (now, row["kakao_place_id"]),
        )
        return

    candidates = [_naver_to_candidate(it) for it in items]
    best, conf = best_match(
        source_name=row["place_name"],
        source_address=row["road_address_name"] or row["address_name"] or "",
        source_phone=row["phone"] or "",
        source_lng=row["lng"],
        source_lat=row["lat"],
        candidates=candidates,
    )

    if best and conf >= MIN_CONFIDENCE:
        it: NaverItem = best["_raw"]
        stats.matched += 1
        await db.execute(
            """
            UPDATE pilates_studio
               SET naver_place_id = ?, naver_url = ?, naver_checked_at = ?
             WHERE kakao_place_id = ?
            """,
            (it.place_id, it.link, now, row["kakao_place_id"]),
        )
    else:
        await db.execute(
            "UPDATE pilates_studio SET naver_checked_at=? WHERE kakao_place_id=?",
            (now, row["kakao_place_id"]),
        )


async def _enrich_one_google(
    db: aiosqlite.Connection,
    client: GoogleClient,
    row: aiosqlite.Row,
    stats: EnrichStats,
) -> None:
    q = _google_query(row)
    now = dbmod.utcnow_iso()
    try:
        items = await client.search_text(
            q, lng=row["lng"], lat=row["lat"], radius_m=1500, max_results=5
        )
    except Exception as e:  # noqa: BLE001
        stats.errors += 1
        await db.execute(
            "UPDATE pilates_studio SET google_checked_at=? WHERE kakao_place_id=?",
            (now, row["kakao_place_id"]),
        )
        return

    stats.checked += 1
    if not items:
        stats.no_result += 1
        await db.execute(
            "UPDATE pilates_studio SET google_checked_at=? WHERE kakao_place_id=?",
            (now, row["kakao_place_id"]),
        )
        return

    candidates = [_google_to_candidate(it) for it in items]
    best, conf = best_match(
        source_name=row["place_name"],
        source_address=row["road_address_name"] or row["address_name"] or "",
        source_phone=row["phone"] or "",
        source_lng=row["lng"],
        source_lat=row["lat"],
        candidates=candidates,
    )

    if best and conf >= MIN_CONFIDENCE:
        it: GoogleItem = best["_raw"]
        stats.matched += 1
        await db.execute(
            """
            UPDATE pilates_studio
               SET google_place_id = ?, google_rating = ?, google_review_count = ?,
                   google_checked_at = ?,
                   homepage_url = COALESCE(homepage_url, ?)
             WHERE kakao_place_id = ?
            """,
            (
                it.place_id,
                it.rating,
                it.review_count,
                now,
                it.website,
                row["kakao_place_id"],
            ),
        )
    else:
        await db.execute(
            "UPDATE pilates_studio SET google_checked_at=? WHERE kakao_place_id=?",
            (now, row["kakao_place_id"]),
        )


async def enrich_naver(batch_size: int = 200) -> EnrichStats:
    stats = EnrichStats()
    conn = await dbmod.connect(SETTINGS.db_path)
    sem = asyncio.Semaphore(SETTINGS.concurrency)
    start = time.time()
    try:
        async with NaverClient(
            SETTINGS.naver_client_id,
            SETTINGS.naver_client_secret,
            rps=SETTINGS.rps,
        ) as client:
            while True:
                rows = await _studios_needing_naver(conn, limit=batch_size)
                if not rows:
                    break

                async def _run(r):
                    async with sem:
                        await _enrich_one_naver(conn, client, r, stats)

                await asyncio.gather(*[_run(r) for r in rows])
                await conn.commit()
                elapsed = time.time() - start
                print(
                    f"[naver] checked={stats.checked} matched={stats.matched} "
                    f"empty={stats.no_result} err={stats.errors} "
                    f"rate={stats.checked / max(elapsed, 1):.1f}/s",
                    flush=True,
                )
    finally:
        await conn.close()
    return stats


async def _studios_needing_kakao_detail(
    db: aiosqlite.Connection, limit: int
) -> list[aiosqlite.Row]:
    async with db.execute(
        """
        SELECT kakao_place_id
          FROM pilates_studio
         WHERE is_pilates = 1 AND kakao_detail_checked_at IS NULL
      ORDER BY kakao_place_id
         LIMIT ?
        """,
        (limit,),
    ) as cur:
        return await cur.fetchall()


async def _enrich_one_kakao_detail(
    db: aiosqlite.Connection,
    client: KakaoDetailClient,
    place_id: str,
    stats: EnrichStats,
) -> None:
    now = dbmod.utcnow_iso()
    try:
        detail = await client.fetch(place_id)
    except Exception as e:  # noqa: BLE001
        stats.errors += 1
        await db.execute(
            "UPDATE pilates_studio SET kakao_detail_checked_at=? WHERE kakao_place_id=?",
            (now, place_id),
        )
        return

    stats.checked += 1
    if detail is None:
        stats.no_result += 1
        await db.execute(
            "UPDATE pilates_studio SET kakao_detail_checked_at=? WHERE kakao_place_id=?",
            (now, place_id),
        )
        return

    stats.matched += 1
    await db.execute(
        """
        UPDATE pilates_studio SET
            homepage_url        = COALESCE(homepage_url, ?),
            instagram_handle    = COALESCE(instagram_handle, ?),
            naver_blog_handle   = COALESCE(naver_blog_handle, ?),
            kakao_channel_name  = ?,
            kakao_channel_url   = ?,
            kakao_review_count  = ?,
            kakao_review_score  = ?,
            kakao_photo_count   = ?,
            blog_review_count   = ?,
            blog_review_urls    = ?,
            menu_count          = ?,
            menu_price_min      = ?,
            menu_price_max      = ?,
            has_coupon          = ?,
            open_hours_raw      = ?,
            kakao_detail_checked_at = ?,
            kakao_detail_raw    = ?
          WHERE kakao_place_id = ?
        """,
        (
            detail.homepage_url,
            detail.instagram_handle,
            detail.naver_blog_handle,
            detail.kakao_channel_name,
            detail.kakao_channel_url,
            detail.kakao_review_count,
            detail.kakao_review_score,
            detail.kakao_photo_count,
            detail.blog_review_count,
            json.dumps(detail.blog_review_urls, ensure_ascii=False) if detail.blog_review_urls else None,
            detail.menu_count,
            detail.menu_price_min,
            detail.menu_price_max,
            1 if detail.has_coupon else 0,
            json.dumps(detail.open_hours_raw, ensure_ascii=False) if detail.open_hours_raw else None,
            now,
            json.dumps(detail.raw, ensure_ascii=False) if detail.raw else None,
            place_id,
        ),
    )


async def enrich_kakao_detail(batch_size: int = 200) -> EnrichStats:
    stats = EnrichStats()
    conn = await dbmod.connect(SETTINGS.db_path)
    sem = asyncio.Semaphore(SETTINGS.concurrency)
    start = time.time()
    try:
        async with KakaoDetailClient(rps=SETTINGS.rps) as client:
            while True:
                rows = await _studios_needing_kakao_detail(conn, limit=batch_size)
                if not rows:
                    break

                async def _run(r):
                    async with sem:
                        await _enrich_one_kakao_detail(
                            conn, client, r["kakao_place_id"], stats
                        )

                await asyncio.gather(*[_run(r) for r in rows])
                await conn.commit()
                elapsed = time.time() - start
                print(
                    f"[kakao-detail] checked={stats.checked} got={stats.matched} "
                    f"404={stats.no_result} err={stats.errors} "
                    f"rate={stats.checked / max(elapsed, 1):.1f}/s",
                    flush=True,
                )
    finally:
        await conn.close()
    return stats


async def enrich_google(batch_size: int = 200) -> EnrichStats:
    stats = EnrichStats()
    conn = await dbmod.connect(SETTINGS.db_path)
    sem = asyncio.Semaphore(SETTINGS.concurrency)
    start = time.time()
    try:
        async with GoogleClient(SETTINGS.google_key, rps=SETTINGS.rps) as client:
            while True:
                rows = await _studios_needing_google(conn, limit=batch_size)
                if not rows:
                    break

                async def _run(r):
                    async with sem:
                        await _enrich_one_google(conn, client, r, stats)

                await asyncio.gather(*[_run(r) for r in rows])
                await conn.commit()
                elapsed = time.time() - start
                print(
                    f"[google] checked={stats.checked} matched={stats.matched} "
                    f"empty={stats.no_result} err={stats.errors} "
                    f"rate={stats.checked / max(elapsed, 1):.1f}/s",
                    flush=True,
                )
    finally:
        await conn.close()
    return stats
