"""운영 DB의 raw_json에서 사진 URL 리스트를 추출해 전용 컬럼에 저장.
사용자 로컬에서 실행:  python scripts/extract_photos_from_raw.py
"""
from __future__ import annotations
import sqlite3, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB = ROOT / "data" / "pilates.db"

def extract_photos(d: dict) -> tuple[list[dict], str | None, int]:
    out: list[dict] = []
    main = None
    seen = set()
    # basicInfo.mainphotourl
    bi = d.get("basicInfo") or d.get("basicinfo") or {}
    mp = bi.get("mainphotourl") or bi.get("mainPhotoUrl")
    if mp:
        url = mp if mp.startswith("http") else f"https:{mp}"
        if url.startswith("//"): url = "https:" + url
        main = url
        out.append({"u": url, "s": "kakao"}); seen.add(url)
    # photo.photoList[*].list[*].orgurl/photourl
    photo = d.get("photo") or {}
    photoList = photo.get("photoList") or []
    for group in photoList:
        items = group.get("list") if isinstance(group, dict) else []
        for it in (items or []):
            url = it.get("orgurl") or it.get("photourl") or it.get("url")
            if not url: continue
            if url.startswith("//"): url = "https:" + url
            if url in seen: continue
            seen.add(url); out.append({"u": url, "s": "kakao"})
    return out[:10], main, len(out)

def main():
    if not DB.exists():
        print(f"[err] {DB} 없음")
        sys.exit(1)
    con = sqlite3.connect(str(DB))
    # 컬럼 추가 (idempotent)
    for ddl in [
        "ALTER TABLE pilates_studio ADD COLUMN photo_urls TEXT",
        "ALTER TABLE pilates_studio ADD COLUMN photo_main TEXT",
        "ALTER TABLE pilates_studio ADD COLUMN photo_count_real INTEGER",
        "ALTER TABLE pilates_studio ADD COLUMN photo_collected_at TEXT",
    ]:
        try: con.execute(ddl)
        except sqlite3.OperationalError: pass

    rows = con.execute("""
        SELECT kakao_place_id, raw_json
          FROM pilates_studio
         WHERE is_pilates=1 AND raw_json IS NOT NULL
    """).fetchall()
    print(f"대상 {len(rows)}건")
    n_extracted = 0
    n_main = 0
    from datetime import datetime
    now = datetime.utcnow().isoformat()
    for kid, raw in rows:
        try: d = json.loads(raw)
        except: continue
        photos, main, count = extract_photos(d)
        if not photos and not main: continue
        con.execute(
            "UPDATE pilates_studio SET photo_urls=?, photo_main=?, photo_count_real=?, photo_collected_at=? WHERE kakao_place_id=?",
            (json.dumps(photos, ensure_ascii=False) if photos else None, main, count, now, kid),
        )
        n_extracted += 1
        if main: n_main += 1
    con.commit()
    print(f"[ok] photo_urls 채움 {n_extracted}건, photo_main {n_main}건")
    print(f"[next] python scripts/build_web_db.py 로 슬림 DB 다시 빌드해주세요.")

if __name__ == "__main__":
    main()
