"""
세종특별자치시 sigungu 정정 스크립트.

원인: 카카오 API에서 세종은 시·군·구 없이 동·읍·면 직속이라 sigungu 컬럼에
도로명이 잘못 추출됨 (예: '마음로', '한누리대로').

해결: address_name에서 '세종특별자치시 ○○동/읍/면' 패턴을 추출해 sigungu에 재기록.

검증: 실행 전·후 카운트, 미파싱 0건 확인.
"""
import sqlite3
import re
import sys
from pathlib import Path

DB = Path(__file__).resolve().parent.parent / "web" / "data" / "pilates.db"
PATTERN = re.compile(r"세종특별자치시\s+(\S+?(?:동|읍|면))(?:\s|$)")

def main():
    if not DB.exists():
        print(f"[ERR] DB not found: {DB}", file=sys.stderr); sys.exit(1)
    con = sqlite3.connect(str(DB))
    con.row_factory = sqlite3.Row

    print("=== 실행 전 ===")
    before = list(con.execute(
        "SELECT sigungu, COUNT(*) c FROM pilates_studio "
        "WHERE sido='세종' GROUP BY sigungu ORDER BY c DESC LIMIT 5"
    ))
    for r in before:
        print(f"  {r['sigungu']!r:20s} {r['c']}")

    rows = list(con.execute(
        "SELECT rowid, sigungu, address_name FROM pilates_studio WHERE sido='세종'"
    ))
    updates = []
    miss = 0
    for r in rows:
        m = PATTERN.search(r["address_name"] or "")
        if m:
            new_sigungu = m.group(1)
            if new_sigungu != r["sigungu"]:
                updates.append((new_sigungu, r["rowid"]))
        else:
            miss += 1
            print(f"  [MISS] rowid={r['rowid']} addr={r['address_name']!r}")

    print(f"\n총 세종 row: {len(rows)}, 정정 대상: {len(updates)}, 미파싱: {miss}")
    if miss > 0:
        print("[WARN] 미파싱 행 있음 — 검토 필요"); 
    if not updates:
        print("[INFO] 변경 없음, 종료"); return

    con.executemany("UPDATE pilates_studio SET sigungu=? WHERE rowid=?", updates)
    con.commit()

    print("\n=== 실행 후 (세종 sigungu top 20) ===")
    for r in con.execute(
        "SELECT sigungu, COUNT(*) c FROM pilates_studio WHERE sido='세종' "
        "GROUP BY sigungu ORDER BY c DESC LIMIT 20"
    ):
        print(f"  {r['sigungu']!r:20s} {r['c']}")

    print("\n=== 전체 sigungu 어미 분포 (재검증) ===")
    endings = {}
    for r in con.execute("SELECT sigungu FROM pilates_studio WHERE sigungu!=''"):
        sg = r["sigungu"]
        if not sg: continue
        last = sg[-1]
        endings[last] = endings.get(last, 0) + 1
    for k, v in sorted(endings.items(), key=lambda x: -x[1]):
        print(f"  '{k}' 끝: {v}")

if __name__ == "__main__":
    main()
