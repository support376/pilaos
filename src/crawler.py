from __future__ import annotations

import asyncio
import sys
import time

from . import db as dbmod
from .config import SETTINGS
from .filters import classify_pilates, normalize_name, parse_sido_sigungu
from .grid import Cell, generate_initial_grid, split_cell
from .kakao import CellResult, KakaoClient


async def seed_initial_grid() -> int:
    cells = generate_initial_grid(
        step_deg=SETTINGS.grid_step_deg,
        radius_m=SETTINGS.initial_radius_m,
    )
    inserted = 0
    conn = await dbmod.connect(SETTINGS.db_path)
    try:
        for c in cells:
            if await dbmod.insert_cell(
                conn,
                cell_key=c.key,
                lng=c.lng,
                lat=c.lat,
                radius_m=c.radius_m,
                depth=c.depth,
                parent_key=None,
            ):
                inserted += 1
        await conn.commit()
    finally:
        await conn.close()
    return inserted


async def _process_cell(
    conn,
    client: KakaoClient,
    cell_row,
    sem: asyncio.Semaphore,
    stats: dict,
) -> None:
    async with sem:
        cell = Cell(
            lng=cell_row["lng"],
            lat=cell_row["lat"],
            radius_m=cell_row["radius_m"],
            depth=cell_row["depth"],
        )
        await dbmod.mark_cell_running(conn, cell.key)
        await conn.commit()

        try:
            res: CellResult = await client.search_cell(
                SETTINGS.query, cell.lng, cell.lat, cell.radius_m
            )
        except Exception as e:  # noqa: BLE001
            await dbmod.mark_cell_error(conn, cell.key, f"{type(e).__name__}: {e}")
            await conn.commit()
            stats["errors"] += 1
            return

        collected = 0
        for doc in res.documents:
            try:
                lng = float(doc.get("x"))
                lat = float(doc.get("y"))
            except (TypeError, ValueError):
                continue
            is_pil, reason = classify_pilates(doc)
            name_norm = normalize_name(doc.get("place_name", ""))
            sido, sigungu = parse_sido_sigungu(
                doc.get("road_address_name") or doc.get("address_name") or ""
            )
            doc["x"] = str(lng)
            doc["y"] = str(lat)
            await dbmod.upsert_studio(
                conn,
                doc,
                is_pilates=is_pil,
                reason=reason,
                name_norm=name_norm,
                sido=sido,
                sigungu=sigungu,
            )
            collected += 1
            if is_pil:
                stats["pilates"] += 1

        children_generated = 0
        if res.is_full and cell.depth < SETTINGS.max_depth:
            for child in split_cell(cell):
                if await dbmod.insert_cell(
                    conn,
                    cell_key=child.key,
                    lng=child.lng,
                    lat=child.lat,
                    radius_m=child.radius_m,
                    depth=child.depth,
                    parent_key=cell.key,
                ):
                    children_generated += 1

        await dbmod.mark_cell_done(
            conn,
            cell.key,
            total_count=res.total_count,
            documents_collected=collected,
            was_full=res.is_full,
            children_generated=children_generated,
        )
        await conn.commit()

        stats["cells_done"] += 1
        stats["docs"] += collected
        stats["split"] += 1 if children_generated else 0


async def run_crawl(batch_size: int = 100) -> None:
    conn = await dbmod.connect(SETTINGS.db_path)
    sem = asyncio.Semaphore(SETTINGS.concurrency)
    stats = {"cells_done": 0, "docs": 0, "pilates": 0, "errors": 0, "split": 0}

    start = time.time()
    try:
        async with KakaoClient(SETTINGS.kakao_key, rps=SETTINGS.rps) as client:
            while True:
                rows = await dbmod.claim_pending_cells(conn, limit=batch_size)
                if not rows:
                    break
                tasks = [
                    _process_cell(conn, client, row, sem, stats) for row in rows
                ]
                await asyncio.gather(*tasks, return_exceptions=False)

                elapsed = time.time() - start
                rps = stats["cells_done"] / elapsed if elapsed else 0
                print(
                    f"[progress] cells_done={stats['cells_done']} "
                    f"docs={stats['docs']} pilates={stats['pilates']} "
                    f"split={stats['split']} errors={stats['errors']} "
                    f"rate={rps:.1f} cells/s",
                    flush=True,
                )
    finally:
        await conn.close()

    elapsed = time.time() - start
    print(
        f"[done] elapsed={elapsed:.1f}s "
        f"cells_done={stats['cells_done']} docs={stats['docs']} "
        f"pilates={stats['pilates']} errors={stats['errors']}",
        flush=True,
    )


async def status() -> dict:
    conn = await dbmod.connect(SETTINGS.db_path)
    try:
        return await dbmod.counts(conn)
    finally:
        await conn.close()


def _ensure_windows_policy() -> None:
    if sys.platform.startswith("win"):
        try:
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        except Exception:
            pass
