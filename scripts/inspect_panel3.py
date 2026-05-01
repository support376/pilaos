"""운영 DB의 raw_json 컬럼 (panel3 응답)을 까서 사진 키 위치를 찾는다.
사용자 로컬에서 실행:  python scripts/inspect_panel3.py
"""
from __future__ import annotations
import sqlite3, json, sys, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB = ROOT / "data" / "pilates.db"

def main():
    if not DB.exists():
        print(f"[err] {DB} 없음. 운영 DB가 있어야 합니다.")
        sys.exit(1)
    con = sqlite3.connect(str(DB))
    rows = con.execute("""
        SELECT kakao_place_id, place_name, raw_json
          FROM pilates_studio
         WHERE is_pilates=1 AND raw_json IS NOT NULL
         LIMIT 200
    """).fetchall()
    print(f"샘플 {len(rows)}건 분석")
    keys = collections.Counter()
    photo_paths = collections.Counter()
    photo_yes = 0
    main_photo_yes = 0
    sample_dump = []
    for kid, name, raw in rows:
        try: d = json.loads(raw)
        except: continue
        keys.update(d.keys())
        if "photo" in d:
            ph = d["photo"]
            for k in (ph.keys() if isinstance(ph, dict) else []):
                photo_paths[f"photo.{k}"] += 1
            if isinstance(ph, dict) and ph.get("photoList"):
                photo_yes += 1
        if isinstance(d.get("basicInfo"), dict) and d["basicInfo"].get("mainphotourl"):
            main_photo_yes += 1
        if len(sample_dump) < 3 and "photo" in d:
            sample_dump.append((kid, name, json.dumps(d.get("photo"), ensure_ascii=False)[:600]))

    print("\n=== top-level 키 ===")
    for k, n in keys.most_common(20): print(f"  {n:>3}  {k}")
    print(f"\n=== photo 보유 ===  photoList={photo_yes}/{len(rows)}  mainphotourl={main_photo_yes}/{len(rows)}")
    print("\n=== photo 하위 키 ===")
    for k, n in photo_paths.most_common(20): print(f"  {n:>3}  {k}")
    print("\n=== 샘플 dump (3건) ===")
    for kid, name, blob in sample_dump:
        print(f"\n# {kid}  {name}\n{blob}")

if __name__ == "__main__":
    main()
