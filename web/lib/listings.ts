// Listing 계층 — pilates_studio + DB에 사전 계산된 est_* 컬럼 활용 (v3.2 ~)
//
// 모든 매물은 기본 "잠재매물(potential)" 상태. estimate는 빌드 타임에 precompute_estimates.py로 계산되어 DB에 저장됨.

import { db } from "./db";
import { Studio, Listing, ListingBadge, ListingStatus, ChannelLink, ListingEstimate, ConfidenceLevel } from "./types";
import { brandFromName } from "./brands";

const STUDIO_COLS = `
  kakao_place_id, place_name, category_name, phone,
  road_address_name, address_name, sido, sigungu,
  lng, lat, place_url,
  naver_url,
  homepage_url, instagram_handle, naver_blog_handle,
  kakao_channel_name, kakao_channel_url,
  kakao_review_count, kakao_review_score, kakao_photo_count,
  blog_review_count, menu_count, menu_price_min, menu_price_max,
  has_coupon
`;

const ESTIMATE_COLS = `
  est_member_count, est_monthly_fee,
  est_monthly_revenue_low, est_monthly_revenue, est_monthly_revenue_high,
  est_monthly_profit, est_monthly_rent, est_deposit,
  est_key_money_low, est_key_money, est_key_money_high,
  est_total_acquisition, est_yield_pct, est_payback_months, est_payback_total_months,
  est_annual_roi, est_multiple, est_confidence, est_confidence_score,
  est_sell_signal, est_model_version
`;

type StudioRow = Studio & {
  est_member_count: number | null;
  est_monthly_fee: number | null;
  est_monthly_revenue_low: number | null;
  est_monthly_revenue: number | null;
  est_monthly_revenue_high: number | null;
  est_monthly_profit: number | null;
  est_monthly_rent: number | null;
  est_deposit: number | null;
  est_key_money_low: number | null;
  est_key_money: number | null;
  est_key_money_high: number | null;
  est_total_acquisition: number | null;
  est_yield_pct: number | null;
  est_payback_months: number | null;
  est_payback_total_months: number | null;
  est_annual_roi: number | null;
  est_multiple: number | null;
  est_confidence: string | null;
  est_confidence_score: number | null;
  est_sell_signal: number | null;
  est_model_version: string | null;
};

function rangeOf(low: number | null, mid: number | null, high: number | null) {
  return { low: low ?? 0, mid: mid ?? 0, high: high ?? 0 };
}

function rowToEstimate(row: StudioRow): ListingEstimate {
  return {
    monthly_revenue: rangeOf(row.est_monthly_revenue_low, row.est_monthly_revenue, row.est_monthly_revenue_high),
    monthly_profit: rangeOf(Math.round((row.est_monthly_profit ?? 0) * 0.6), row.est_monthly_profit, Math.round((row.est_monthly_profit ?? 0) * 1.4)),
    key_money: rangeOf(row.est_key_money_low, row.est_key_money, row.est_key_money_high),
    monthly_rent: rangeOf(Math.round((row.est_monthly_rent ?? 0) * 0.8), row.est_monthly_rent, Math.round((row.est_monthly_rent ?? 0) * 1.2)),
    deposit: rangeOf(Math.round((row.est_deposit ?? 0) * 0.8), row.est_deposit, Math.round((row.est_deposit ?? 0) * 1.2)),
    member_count: rangeOf(Math.round((row.est_member_count ?? 0) * 0.7), row.est_member_count, Math.round((row.est_member_count ?? 0) * 1.3)),
    total_acquisition: rangeOf(Math.round((row.est_total_acquisition ?? 0) * 0.65), row.est_total_acquisition, Math.round((row.est_total_acquisition ?? 0) * 1.35)),
    monthly_yield_pct: row.est_yield_pct ?? 0,
    payback_months_keyMoney: row.est_payback_months ?? 999,
    payback_months_total: row.est_payback_total_months ?? 999,
    annual_roi_pct: row.est_annual_roi ?? 0,
    multiple_used: row.est_multiple ?? 6,
    confidence: (row.est_confidence as ConfidenceLevel) ?? "estimate",
    confidence_score: row.est_confidence_score ?? 0.55,
    sell_signal_score: row.est_sell_signal ?? 50,
  };
}

export function studioToListing(s: StudioRow): Listing {
  const status: ListingStatus = "cold";
  const est = rowToEstimate(s);

  let dong: string | null = null;
  const addr = s.road_address_name || s.address_name || "";
  const m = addr.match(/([가-힣]+동|[가-힣]+가|[가-힣]+로[0-9]*|[가-힣]+길)/);
  if (m) dong = m[1];

  const reviewSum = (s.kakao_review_count ?? 0) + (s.blog_review_count ?? 0);
  const channelCount = [s.naver_url, s.homepage_url, s.instagram_handle, s.naver_blog_handle, s.kakao_channel_name].filter(Boolean).length;
  const oneLinerParts: string[] = [];
  if (s.sigungu) oneLinerParts.push(s.sigungu);
  if (reviewSum > 0) oneLinerParts.push(`리뷰 ${reviewSum}`);
  if (channelCount > 0) oneLinerParts.push(`채널 ${channelCount}/5`);

  const titleParts: string[] = [];
  if (s.sigungu) titleParts.push(s.sigungu);
  if (dong) titleParts.push(dong);

  const digital = (() => {
    let score = 10;
    if (s.naver_url) score += 15;
    if (s.kakao_channel_name) score += 10;
    if (s.homepage_url) score += 10;
    if (s.instagram_handle) score += 15;
    if (s.naver_blog_handle) score += 5;
    const k = s.kakao_review_count ?? 0;
    if (k >= 20) score += 10; else if (k >= 5) score += 6; else if (k >= 1) score += 3;
    const b = s.blog_review_count ?? 0;
    if (b >= 20) score += 10; else if (b >= 5) score += 6; else if (b >= 1) score += 3;
    if ((s.menu_count ?? 0) > 0) score += 5;
    return score;
  })();
  const digitalGradeOf = (s_: number) =>
    s_ >= 75 ? "A" : s_ >= 60 ? "B" : s_ >= 45 ? "C" : s_ >= 30 ? "D" : "F";

  const listedAt = new Date("2026-04-23").toISOString();

  return {
    id: `PIL-${s.kakao_place_id}`,
    studio_id: s.kakao_place_id,
    status,
    badges: [],
    title: titleParts.join(" · ") || s.place_name,
    one_liner: oneLinerParts.join(" · ") || "정보 수집 중",
    sido: s.sido,
    sigungu: s.sigungu,
    dong,
    full_address: null,
    lng: s.lng,
    lat: s.lat,
    area_m2: null,
    area_pyeong: null,
    floor: null,
    brand_slug: brandFromName(s.place_name),
    reformer_count: null,
    group_room: null,
    private_room: null,
    has_shower: false,
    has_parking: false,
    has_sauna: false,
    has_flying: false,
    has_barre: false,
    studio: s,
    digital_score: digital,
    digital_grade: digitalGradeOf(digital) as Listing["digital_grade"],
    estimate: est,
    view_count: 0,
    fav_count: 0,
    buyer_intent_count: 0,
    last_owner_check_at: null,
    listed_at: listedAt,
  };
}

export function channelsOf(s: Studio): ChannelLink[] {
  const out: ChannelLink[] = [];
  if (s.place_url) out.push({ kind: "kakao_place", label: "카카오맵", url: s.place_url, has_data: true });
  if (s.naver_url) out.push({ kind: "naver_place", label: "네이버 플레이스", url: s.naver_url, has_data: true });
  if (s.homepage_url) out.push({ kind: "homepage", label: "홈페이지", url: s.homepage_url, has_data: true });
  if (s.instagram_handle) out.push({ kind: "instagram", label: `@${s.instagram_handle}`, url: `https://instagram.com/${s.instagram_handle}`, has_data: true });
  if (s.naver_blog_handle) out.push({ kind: "naver_blog", label: "네이버 블로그", url: `https://blog.naver.com/${s.naver_blog_handle}`, has_data: true });
  if (s.kakao_channel_url) out.push({ kind: "kakao_channel", label: s.kakao_channel_name ?? "카카오톡 채널", url: s.kakao_channel_url, has_data: true });
  return out;
}

export type ListingFilters = {
  q?: string;
  sigungu?: string;
  sido?: string;
  brand?: string;
  badge?: ListingBadge;
  ownerDirect?: boolean;
  status?: ListingStatus;
  keyMoneyMin?: number;
  keyMoneyMax?: number;
  totalAcqMax?: number;
  yieldMin?: number;
  paybackMax?: number;
  hasNaver?: boolean;
  hasKakaoChannel?: boolean;
  hasInstagram?: boolean;
  hasBlog?: boolean;
  hasHomepage?: boolean;
  hasReviews?: boolean;
  noKeyMoney?: boolean;
};

export type ListingSort =
  | "ad"
  | "yield_desc" | "yield_asc"
  | "payback_asc" | "payback_desc"
  | "key_desc" | "key_asc"
  | "rev_desc" | "rev_asc"
  | "total_asc" | "total_desc"
  | "newest" | "owner_check"
  | "fav" | "views"
  | "score";

export function getListing(id: string): Listing | null {
  const kid = id.startsWith("PIL-") ? id.slice(4) : id;
  const row = db()
    .prepare(`SELECT ${STUDIO_COLS}, ${ESTIMATE_COLS} FROM pilates_studio WHERE kakao_place_id = ? AND is_pilates = 1`)
    .get(kid) as StudioRow | undefined;
  if (!row) return null;
  return studioToListing(row);
}

let _allCache: Listing[] | null = null;
export function listAllListings(): Listing[] {
  if (_allCache) return _allCache;
  const rows = db()
    .prepare(`SELECT ${STUDIO_COLS}, ${ESTIMATE_COLS} FROM pilates_studio WHERE is_pilates = 1`)
    .all() as StudioRow[];
  _allCache = rows.map(studioToListing);
  return _allCache;
}

export function searchListings(filters: ListingFilters, sort: ListingSort = "ad", limit = 60, offset = 0): { rows: Listing[]; total: number } {
  let rows = listAllListings();

  if (filters.q) {
    const q = filters.q.toLowerCase();
    rows = rows.filter((l) => {
      const haystack = `${l.studio.place_name} ${l.sigungu ?? ""} ${l.dong ?? ""} ${l.studio.road_address_name ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }
  if (filters.sigungu) rows = rows.filter((l) => l.sigungu === filters.sigungu);
  if (filters.sido) rows = rows.filter((l) => l.sido === filters.sido);
  if (filters.brand && filters.brand !== "all") rows = rows.filter((l) => l.brand_slug === filters.brand);
  if (filters.status) rows = rows.filter((l) => l.status === filters.status);
  if (filters.noKeyMoney) rows = rows.filter((l) => l.estimate.key_money.mid <= 500);
  if (typeof filters.keyMoneyMin === "number") rows = rows.filter((l) => l.estimate.key_money.mid >= filters.keyMoneyMin!);
  if (typeof filters.keyMoneyMax === "number") rows = rows.filter((l) => l.estimate.key_money.mid <= filters.keyMoneyMax!);
  if (typeof filters.totalAcqMax === "number") rows = rows.filter((l) => l.estimate.total_acquisition.mid <= filters.totalAcqMax!);
  if (typeof filters.yieldMin === "number") rows = rows.filter((l) => l.estimate.monthly_yield_pct >= filters.yieldMin!);
  if (typeof filters.paybackMax === "number") rows = rows.filter((l) => l.estimate.payback_months_keyMoney <= filters.paybackMax!);
  if (filters.hasNaver) rows = rows.filter((l) => !!l.studio.naver_url);
  if (filters.hasKakaoChannel) rows = rows.filter((l) => !!l.studio.kakao_channel_name);
  if (filters.hasInstagram) rows = rows.filter((l) => !!l.studio.instagram_handle);
  if (filters.hasBlog) rows = rows.filter((l) => !!l.studio.naver_blog_handle);
  if (filters.hasHomepage) rows = rows.filter((l) => !!l.studio.homepage_url);
  if (filters.hasReviews) rows = rows.filter((l) => (l.studio.kakao_review_count ?? 0) > 0);

  const cmp = (a: Listing, b: Listing): number => {
    switch (sort) {
      case "yield_desc": return b.estimate.monthly_yield_pct - a.estimate.monthly_yield_pct;
      case "yield_asc": return a.estimate.monthly_yield_pct - b.estimate.monthly_yield_pct;
      case "payback_asc": return a.estimate.payback_months_keyMoney - b.estimate.payback_months_keyMoney;
      case "payback_desc": return b.estimate.payback_months_keyMoney - a.estimate.payback_months_keyMoney;
      case "key_desc": return b.estimate.key_money.mid - a.estimate.key_money.mid;
      case "key_asc": return a.estimate.key_money.mid - b.estimate.key_money.mid;
      case "rev_desc": return b.estimate.monthly_revenue.mid - a.estimate.monthly_revenue.mid;
      case "rev_asc": return a.estimate.monthly_revenue.mid - b.estimate.monthly_revenue.mid;
      case "total_asc": return a.estimate.total_acquisition.mid - b.estimate.total_acquisition.mid;
      case "total_desc": return b.estimate.total_acquisition.mid - a.estimate.total_acquisition.mid;
      case "newest": return new Date(b.listed_at).getTime() - new Date(a.listed_at).getTime();
      case "score": return b.digital_score - a.digital_score;
      case "ad":
      default:
        return b.digital_score - a.digital_score;
    }
  };
  rows.sort(cmp);

  const total = rows.length;
  const sliced = rows.slice(offset, offset + limit);
  return { rows: sliced, total };
}

export function listingsBySigungu(sido: string, sigungu: string, limit = 200): Listing[] {
  const all = listAllListings();
  return all.filter((l) => l.sido === sido && l.sigungu === sigungu).slice(0, limit);
}

export function summary(): {
  total: number;
  by_sido: { sido: string; n: number }[];
  by_sigungu: { sido: string; sigungu: string; count: number }[];
  intent_sell_count: number;
  buyer_pool: number;
  potential_count: number;
  claimed_count: number;
} {
  const all = listAllListings();
  const by_sido = Object.entries(
    all.reduce((m, l) => {
      if (!l.sido) return m;
      m[l.sido] = (m[l.sido] || 0) + 1;
      return m;
    }, {} as Record<string, number>)
  ).map(([sido, n]) => ({ sido, n })).sort((a, b) => b.n - a.n);

  const sgMap = new Map<string, { sido: string; sigungu: string; count: number }>();
  for (const l of all) {
    if (!l.sido || !l.sigungu) continue;
    const k = `${l.sido}|${l.sigungu}`;
    const cur = sgMap.get(k);
    if (cur) cur.count++;
    else sgMap.set(k, { sido: l.sido, sigungu: l.sigungu, count: 1 });
  }
  const by_sigungu = Array.from(sgMap.values()).sort((a, b) => b.count - a.count);

  return {
    total: all.length,
    by_sido,
    by_sigungu,
    intent_sell_count: 0,
    buyer_pool: 0,
    potential_count: all.length,
    claimed_count: 0,
  };
}

// Sido 분류: 광역시(특별/광역/특별자치시) vs 도
const METRO_ORDER = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종"];
const DO_ORDER = ["경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
const SIDO_ORDER = [...METRO_ORDER, ...DO_ORDER];

export function isMetroSido(sido: string): boolean {
  return METRO_ORDER.includes(sido);
}

/**
 * 시도→시군구 그룹 트리. 시도 정렬은 행정 표준 순서(광역시 → 도),
 * 각 시도 내 시군구는 가나다순.
 */
export function regionTree(): {
  metros: { sido: string; total: number; sigungu: { sigungu: string; count: number }[] }[];
  dos: { sido: string; total: number; sigungu: { sigungu: string; count: number }[] }[];
} {
  const all = listAllListings();
  const map = new Map<string, Map<string, number>>();
  for (const l of all) {
    if (!l.sido || !l.sigungu) continue;
    if (!map.has(l.sido)) map.set(l.sido, new Map());
    const sm = map.get(l.sido)!;
    sm.set(l.sigungu, (sm.get(l.sigungu) || 0) + 1);
  }

  const build = (sido: string) => {
    const sm = map.get(sido);
    if (!sm) return null;
    const list = Array.from(sm.entries())
      .map(([sigungu, count]) => ({ sigungu, count }))
      .sort((a, b) => a.sigungu.localeCompare(b.sigungu, "ko"));
    const total = list.reduce((s, r) => s + r.count, 0);
    return { sido, total, sigungu: list };
  };

  const metros = METRO_ORDER.map(build).filter((x): x is NonNullable<typeof x> => !!x);
  const dos = DO_ORDER.map(build).filter((x): x is NonNullable<typeof x> => !!x);
  return { metros, dos };
}

/**
 * 인기 지역 chip용 — 시도순 + 시군구 카운트 순으로 안정 정렬한 top N.
 */
export function topRegions(limit = 18): { sido: string; sigungu: string; count: number }[] {
  const all = listAllListings();
  const sgMap = new Map<string, { sido: string; sigungu: string; count: number }>();
  for (const l of all) {
    if (!l.sido || !l.sigungu) continue;
    const k = `${l.sido}|${l.sigungu}`;
    const cur = sgMap.get(k);
    if (cur) cur.count++;
    else sgMap.set(k, { sido: l.sido, sigungu: l.sigungu, count: 1 });
  }
  return Array.from(sgMap.values())
    .sort((a, b) => {
      // 1차: 카운트 내림차순 (인기도)
      if (b.count !== a.count) return b.count - a.count;
      // 2차: 시도 순서 (광역시 우선)
      const ai = SIDO_ORDER.indexOf(a.sido);
      const bi = SIDO_ORDER.indexOf(b.sido);
      if (ai !== bi) return ai - bi;
      // 3차: 시군구 가나다
      return a.sigungu.localeCompare(b.sigungu, "ko");
    })
    .slice(0, limit);
}

export function listingsByBrand(brandSlug: string, limit = 200): Listing[] {
  const all = listAllListings();
  return all.filter((l) => l.brand_slug === brandSlug).slice(0, limit);
}

export function sigunguMarketStats(sido: string, sigungu: string) {
  const rows = listingsBySigungu(sido, sigungu, 1000);
  if (!rows.length) return null;
  const sortedKey = [...rows].map((r) => r.estimate.key_money.mid).sort((a, b) => a - b);
  const sortedRev = [...rows].map((r) => r.estimate.monthly_revenue.mid).sort((a, b) => a - b);
  const sortedYield = [...rows].map((r) => r.estimate.monthly_yield_pct).sort((a, b) => a - b);
  const pct = (arr: number[], p: number) => arr[Math.floor(arr.length * p)] ?? 0;
  return {
    n: rows.length,
    key_p25: pct(sortedKey, 0.25),
    key_p50: pct(sortedKey, 0.5),
    key_p75: pct(sortedKey, 0.75),
    rev_p25: pct(sortedRev, 0.25),
    rev_p50: pct(sortedRev, 0.5),
    rev_p75: pct(sortedRev, 0.75),
    yield_p25: pct(sortedYield, 0.25),
    yield_p50: pct(sortedYield, 0.5),
    yield_p75: pct(sortedYield, 0.75),
  };
}

export function similarListings(l: Listing, n = 4): Listing[] {
  const all = listAllListings();
  const target = l.estimate.key_money.mid;
  return all
    .filter((x) => x.id !== l.id && x.sigungu === l.sigungu)
    .map((x) => ({ x, diff: Math.abs(x.estimate.key_money.mid - target) }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, n)
    .map(({ x }) => x);
}

export type Histogram = { bins: { from: number; to: number; count: number }[]; min: number; max: number; mean: number; median: number; };
export function distribution(values: number[], binCount = 8): Histogram {
  const arr = values.filter((v) => Number.isFinite(v) && v >= 0).sort((a, b) => a - b);
  if (!arr.length) return { bins: [], min: 0, max: 0, mean: 0, median: 0 };
  const min = arr[0], max = arr[arr.length - 1];
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const median = arr[Math.floor(arr.length / 2)];
  const span = Math.max(1, max - min);
  const step = span / binCount;
  const bins = Array.from({ length: binCount }, (_, i) => ({ from: min + step * i, to: min + step * (i + 1), count: 0 }));
  for (const v of arr) {
    const idx = Math.min(binCount - 1, Math.floor((v - min) / step));
    bins[idx].count++;
  }
  return { bins, min, max, mean, median };
}

let _natCache: { keyMoney: Histogram; revenue: Histogram; yield_pct: Histogram } | null = null;
export function nationalDistribution() {
  if (_natCache) return _natCache;
  const all = listAllListings();
  _natCache = {
    keyMoney: distribution(all.map((l) => l.estimate.key_money.mid)),
    revenue: distribution(all.map((l) => l.estimate.monthly_revenue.mid)),
    yield_pct: distribution(all.map((l) => l.estimate.monthly_yield_pct), 10),
  };
  return _natCache;
}

export function sigunguDistribution(sido: string, sigungu: string) {
  const rows = listingsBySigungu(sido, sigungu, 1000);
  return {
    keyMoney: distribution(rows.map((l) => l.estimate.key_money.mid)),
    revenue: distribution(rows.map((l) => l.estimate.monthly_revenue.mid)),
    yield_pct: distribution(rows.map((l) => l.estimate.monthly_yield_pct), 10),
    n: rows.length,
  };
}
