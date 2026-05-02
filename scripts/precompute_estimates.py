"""슬림 DB의 모든 매물에 대해 estimate 값을 미리 계산해 컬럼에 저장.
SSR 매번 계산 → DB SELECT로 전환을 위한 사전 작업.
"""
from __future__ import annotations
import sqlite3, sys, math
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
SLIM_DB = ROOT / "web" / "data" / "pilates.db"
MODEL_VERSION = "v0.2"

SIGUNGU_TIER = {
    "강남구": 1.45, "서초구": 1.4, "송파구": 1.25, "마포구": 1.2, "용산구": 1.2,
    "성동구": 1.15, "광진구": 1.1, "영등포구": 1.1, "동작구": 1.05, "양천구": 1.05,
    "분당구": 1.2, "수지구": 1.1, "기흥구": 1.0, "수원시": 0.95, "성남시": 1.0,
    "고양시": 0.95, "용인시": 0.95, "인천": 0.85, "부산": 0.9, "대구": 0.85,
    "광주": 0.8, "대전": 0.85, "울산": 0.8, "제주시": 0.85,
}

def estimate(row):
    sigungu_mult = SIGUNGU_TIER.get(row["sigungu"], 0.85)
    # digital score
    score = 10
    if row["naver_url"]: score += 15
    if row["kakao_channel_name"]: score += 10
    if row["homepage_url"]: score += 10
    if row["instagram_handle"]: score += 15
    if row["naver_blog_handle"]: score += 5
    k = row["kakao_review_count"] or 0
    if k >= 20: score += 10
    elif k >= 5: score += 6
    elif k >= 1: score += 3
    b = row["blog_review_count"] or 0
    if b >= 20: score += 10
    elif b >= 5: score += 6
    elif b >= 1: score += 3
    if (row["menu_count"] or 0) > 0: score += 5
    digital_bonus = (score - 45) / 90 * 0.3

    # 면적 기본 200㎡ (panel3 raw_json 인스펙션 후 실 데이터로 교체 예정)
    area_m2 = 200
    pyeong = area_m2 / 3.305

    # 회원수
    reviews = (row["kakao_review_count"] or 0) + (row["blog_review_count"] or 0)
    photo_bonus = min(20, (row["kakao_photo_count"] or 0) / 5)
    member_count = round((50 + reviews * 1.5 + photo_bonus + score / 90 * 30) * sigungu_mult)

    # 회비
    lo = row["menu_price_min"] or 0
    hi = row["menu_price_max"] or 0
    if lo > 0 and hi > 0:
        fee = max(15, min(60, round((lo + hi) / 2 / 10000)))
    else:
        fee = 25

    # 매출/임대/순익
    rev = round(member_count * fee)
    rent_per_pyeong = 10 * sigungu_mult
    rent = round(pyeong * rent_per_pyeong)
    deposit = rent * 12
    teachers = max(1, round(area_m2 / 60))
    labor = teachers * 220
    opex = round(rev * 0.10)
    profit = max(0, rev - rent - 30 - labor - opex)

    # 권리금
    multiple = 6.0 + (sigungu_mult - 1.0) * 4 + digital_bonus * 4
    multiple = max(2.5, min(13.0, multiple))
    key_money = max(500, round(profit * multiple))
    setup = round(key_money * 0.15)
    total_acq = key_money + deposit + setup

    yield_pct = round((profit / total_acq) * 1000) / 10 if total_acq > 0 else 0
    payback_key = round(key_money / profit) if profit > 0 else 999
    payback_total = round(total_acq / profit) if profit > 0 else 999
    annual_roi = round(((profit * 12) / total_acq) * 1000) / 10 if total_acq > 0 else 0

    confidence = "estimate"
    conf_score = 0.55
    if score >= 60 and (row["kakao_review_count"] or 0) >= 5:
        conf_score = 0.7
    if score < 25:
        confidence = "reference"
        conf_score = 0.35

    sell_signal = 50
    if score < 30: sell_signal += 25
    if reviews < 3: sell_signal += 15
    if not row["naver_url"]: sell_signal += 5
    if not row["instagram_handle"]: sell_signal += 5
    sell_signal = max(0, min(100, sell_signal))

    return {
        "est_member_count": member_count,
        "est_monthly_fee": fee,
        "est_monthly_revenue_low": round(rev * 0.7),
        "est_monthly_revenue": rev,
        "est_monthly_revenue_high": round(rev * 1.3),
        "est_monthly_profit": profit,
        "est_monthly_rent": rent,
        "est_deposit": deposit,
        "est_key_money_low": round(key_money * 0.55),
        "est_key_money": key_money,
        "est_key_money_high": round(key_money * 1.45),
        "est_total_acquisition": total_acq,
        "est_yield_pct": yield_pct,
        "est_payback_months": payback_key,
        "est_payback_total_months": payback_total,
        "est_annual_roi": annual_roi,
        "est_multiple": round(multiple, 1),
        "est_confidence": confidence,
        "est_confidence_score": conf_score,
        "est_sell_signal": sell_signal,
        "est_model_version": MODEL_VERSION,
    }

def main():
    if not SLIM_DB.exists():
        print(f"[err] {SLIM_DB} 없음")
        sys.exit(1)
    con = sqlite3.connect(str(SLIM_DB))
    con.row_factory = sqlite3.Row

    rows = con.execute("""
        SELECT kakao_place_id, sido, sigungu,
               naver_url, kakao_channel_name, homepage_url, instagram_handle, naver_blog_handle,
               kakao_review_count, blog_review_count, kakao_photo_count, menu_count,
               menu_price_min, menu_price_max
          FROM pilates_studio WHERE is_pilates=1
    """).fetchall()
    print(f"대상 {len(rows)}건 estimate 계산")

    now = datetime.utcnow().isoformat()
    n = 0
    for r in rows:
        e = estimate(r)
        e["est_calculated_at"] = now
        cols = ", ".join(f"{k}=?" for k in e.keys())
        con.execute(
            f"UPDATE pilates_studio SET {cols} WHERE kakao_place_id=?",
            (*e.values(), r["kakao_place_id"]),
        )
        n += 1
        if n % 1000 == 0:
            con.commit()
            print(f"  {n}/{len(rows)}")
    con.commit()
    print(f"[ok] {n}건 estimate 계산·저장 완료 (model {MODEL_VERSION})")

    # VACUUM으로 슬림 DB 사이즈 최적화
    con.execute("VACUUM")
    con.commit()
    print("[ok] VACUUM 완료")

if __name__ == "__main__":
    main()
