// 매물 가치/수익률 추정 v0 — 휴리스틱
//
// 입력: Studio (kakao+naver 머지 데이터) + 시군구 평균
// 출력: ListingEstimate (단위: 만원)
//
// 모든 수치는 "추정"이며 실사 후 보정. 카드에 신뢰등급 같이 노출.
import { Studio, ListingEstimate, EstimateRange, ConfidenceLevel } from "./types";

// 시군구 가중치 (대략) — 임대료/권리금 멀티플 조정
const SIGUNGU_TIER: Record<string, number> = {
  "강남구": 1.45, "서초구": 1.4, "송파구": 1.25, "마포구": 1.2, "용산구": 1.2,
  "성동구": 1.15, "광진구": 1.1, "영등포구": 1.1, "동작구": 1.05, "양천구": 1.05,
  "분당구": 1.2, "수지구": 1.1, "기흥구": 1.0, "수원시": 0.95, "성남시": 1.0,
  "고양시": 0.95, "용인시": 0.95, "인천": 0.85, "부산": 0.9, "대구": 0.85,
  "광주": 0.8, "대전": 0.85, "울산": 0.8, "제주시": 0.85,
};

function sigunguMultiplier(sigungu: string | null): number {
  if (!sigungu) return 0.85;
  return SIGUNGU_TIER[sigungu] ?? 0.85;
}

function range(mid: number, spread = 0.35): EstimateRange {
  return {
    low: Math.round(mid * (1 - spread)),
    mid: Math.round(mid),
    high: Math.round(mid * (1 + spread)),
  };
}

function digitalGrade(s: Studio): { score: number; bonus: number } {
  // lib/score.ts와 동일 산식 요약
  let score = 0;
  if (s.naver_url) score += 15;
  score += 10; // kakao base
  if (s.kakao_channel_name) score += 10;
  if (s.homepage_url) score += 10;
  if (s.instagram_handle) score += 15;
  if (s.naver_blog_handle) score += 5;
  const k = s.kakao_review_count ?? 0;
  if (k >= 20) score += 10; else if (k >= 5) score += 6; else if (k >= 1) score += 3;
  const b = s.blog_review_count ?? 0;
  if (b >= 20) score += 10; else if (b >= 5) score += 6; else if (b >= 1) score += 3;
  if ((s.menu_count ?? 0) > 0) score += 5;
  // 0~90 → -0.15 ~ +0.15 보너스
  const bonus = (score - 45) / 90 * 0.3;
  return { score, bonus };
}

function feeFromMenuPrice(s: Studio): number {
  // menu_price_min/max 평균을 월 회비 추정으로 사용 (단위: 원 → 만원)
  const lo = s.menu_price_min ?? 0;
  const hi = s.menu_price_max ?? 0;
  if (lo > 0 && hi > 0) {
    // 보통 회수권/PT 단가가 섞임 — 절반 보정
    const avg = (lo + hi) / 2;
    return Math.max(15, Math.min(60, Math.round(avg / 10000)));
  }
  return 25; // 시군구 평균 fallback
}

function memberCountEst(s: Studio, sigunguMult: number): number {
  // 베이스 활성 회원수: 리뷰 활동 + 디지털 점수 + 시군구
  const reviews = (s.kakao_review_count ?? 0) + (s.blog_review_count ?? 0);
  const photoBonus = Math.min(20, (s.kakao_photo_count ?? 0) / 5);
  const digital = digitalGrade(s).score / 90;
  // 60명 ± 활동량
  const base = 50 + reviews * 1.5 + photoBonus + digital * 30;
  return Math.round(base * sigunguMult);
}

function rentEst(sigunguMult: number, areaM2: number): { rent: number; deposit: number } {
  // 평당 월세(만원). 평균 대략 10만/평 (강남 18, 외곽 5)
  const rentPerPyeong = 10 * sigunguMult;
  const pyeong = areaM2 / 3.305;
  const monthlyRent = Math.round(pyeong * rentPerPyeong);
  const deposit = Math.round(monthlyRent * 12); // 보증금 ≈ 1년치
  return { rent: monthlyRent, deposit };
}

function multipleEst(sigunguMult: number, digitalBonus: number, leaseMonths: number): number {
  // 권리금 멀티플 base 6 ± 보정
  let m = 6;
  m += (sigunguMult - 1.0) * 4; // 강남=+1.8, 외곽=-0.6
  m += digitalBonus * 4;         // ±0.6
  if (leaseMonths >= 24) m += 0.6;
  return Math.max(2.5, Math.min(13, m));
}

export type EstimateInputs = {
  studio: Studio;
  area_m2?: number | null;
  reformer_count?: number | null;
  lease_months?: number;
};

export function estimateListing(input: EstimateInputs): ListingEstimate {
  const { studio: s } = input;
  const sigunguMult = sigunguMultiplier(s.sigungu);
  const { score: digScore, bonus: digBonus } = digitalGrade(s);

  // 면적: 안 들어오면 75평(248m²) 기본 — 점포라인 매물 평균치
  const areaM2 = input.area_m2 ?? 200;
  const leaseMonths = input.lease_months ?? 18;

  // 회원수 / 회비
  const memberMid = memberCountEst(s, sigunguMult);
  const fee = feeFromMenuPrice(s);

  // 매출 (만원)
  const revenueMid = Math.round(memberMid * fee);

  // 임대 / 보증금
  const { rent, deposit } = rentEst(sigunguMult, areaM2);

  // 인건비: 면적 기반 강사수 추정 × 평균 보수 250만
  const teacherCount = Math.max(1, Math.round(areaM2 / 60));
  const labor = teacherCount * 220;
  const opex = Math.round(revenueMid * 0.10);

  // 순익
  const profitMid = Math.max(0, revenueMid - rent - 30 /*관리비*/ - labor - opex);

  // 권리금
  const mult = multipleEst(sigunguMult, digBonus, leaseMonths);
  const keyMoneyMid = Math.max(500, Math.round(profitMid * mult));

  // 인수운영비(영업개시까지 — 프로모션/예치 등) 약 권리금의 15%
  const setupCost = Math.round(keyMoneyMid * 0.15);

  // 총 인수가
  const totalAcqMid = keyMoneyMid + deposit + setupCost;

  // 5대 지표
  const monthlyYieldPct = totalAcqMid > 0 ? Math.round((profitMid / totalAcqMid) * 1000) / 10 : 0;
  const paybackKey = profitMid > 0 ? Math.round(keyMoneyMid / profitMid) : 999;
  const paybackTotal = profitMid > 0 ? Math.round(totalAcqMid / profitMid) : 999;
  const annualRoi = totalAcqMid > 0 ? Math.round(((profitMid * 12) / totalAcqMid) * 1000) / 10 : 0;

  // 신뢰등급
  let confidence: ConfidenceLevel = "estimate";
  let confidenceScore = 0.55;
  if (digScore >= 60 && (s.kakao_review_count ?? 0) >= 5) {
    confidence = "estimate";
    confidenceScore = 0.7;
  }
  if (digScore < 25) {
    confidence = "reference";
    confidenceScore = 0.35;
  }

  // 매도 시그널(휴리스틱) — 디지털 활동 둔화 프록시
  const reviews = (s.kakao_review_count ?? 0) + (s.blog_review_count ?? 0);
  let sellSignal = 50;
  if (digScore < 30) sellSignal += 25;
  if (reviews < 3) sellSignal += 15;
  if (!s.naver_url) sellSignal += 5;
  if (!s.instagram_handle) sellSignal += 5;
  sellSignal = Math.max(0, Math.min(100, sellSignal));

  return {
    monthly_revenue: range(revenueMid, 0.3),
    monthly_profit: range(profitMid, 0.4),
    key_money: range(keyMoneyMid, 0.45),
    monthly_rent: range(rent, 0.2),
    deposit: range(deposit, 0.2),
    member_count: range(memberMid, 0.3),
    total_acquisition: range(totalAcqMid, 0.35),
    monthly_yield_pct: monthlyYieldPct,
    payback_months_keyMoney: paybackKey,
    payback_months_total: paybackTotal,
    annual_roi_pct: annualRoi,
    multiple_used: Math.round(mult * 10) / 10,
    confidence,
    confidence_score: confidenceScore,
    sell_signal_score: sellSignal,
  };
}

// 만원 단위 정수 → 한국식 표기 ("7,000만" / "1억 2,000만" / "10억 5,000만")
export function fmtMan(amount: number | null | undefined): string {
  if (!amount || amount <= 0) return "—";
  const eok = Math.floor(amount / 10000);
  const man = amount % 10000;
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만`;
  if (eok > 0) return `${eok}억`;
  return `${man.toLocaleString()}만`;
}

export function confidenceLabel(c: ConfidenceLevel): string {
  switch (c) {
    case "verified": return "검증";
    case "owner": return "매도자 신고";
    case "estimate": return "pilaos 추정";
    case "reference": return "참고";
  }
}

export function confidenceColor(c: ConfidenceLevel): string {
  switch (c) {
    case "verified": return "bg-emerald-100 text-emerald-800";
    case "owner": return "bg-amber-100 text-amber-800";
    case "estimate": return "bg-sky-100 text-sky-800";
    case "reference": return "bg-gray-100 text-gray-700";
  }
}
