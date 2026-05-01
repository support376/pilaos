// Listing 계층 — pilates_studio 위에 구축한 가상 listing 엔티티
// 모든 매물은 기본 "잠재매물(potential)" 상태. 주인이 등록 → "claimed". 운영팀 검증 → "verified".
// SQLite는 readonly. 시드 가짜 데이터는 v2.1부터 모두 제거. 실 데이터만 사용.

import { db } from "./db";
import { Studio, Listing, ListingBadge, ListingStatus, ChannelLink } from "./types";
import { estimateListing } from "./estimate";
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

export function studioToListing(s: Studio): Listing {
  // 모든 v2 매물은 "potential" 상태로 시작. 클레임/검증은 별도 워크플로(v3+)에서.
  const status: ListingStatus = "cold"; // 모든 매물 cold = 잠재매물
  const est = estimateListing({
    studio: s,
    area_m2: null,           // ← 시드 제거
    reformer_count: null,    // ← 시드 제거
  });

  // 도/동 추출 (도로명에서 마지막 "동/로/길"의 앞)
  let dong: string | null = null;
  const addr = s.road_address_name || s.address_name || "";
  const m = addr.match(/([가-힣]+동|[가-힣]+가|[가-힣]+로[0-9]*|[가-힣]+길)/);
  if (m) dong = m[1];

  // 한 줄 카피 — 진짜 데이터만으로 생성
  const oneLinerParts: string[] = [];
  if (s.sigungu) oneLinerParts.push(s.sigungu);
  const reviewSum = (s.kakao_review_count ?? 0) + (s.blog_review_count ?? 0);
  if (reviewSum > 0) oneLinerParts.push(`리뷰 ${reviewSum}`);
  const channelCount = [s.naver_url, s.homepage_url, s.instagram_handle, s.naver_blog_handle, s.kakao_channel_name].filter(Boolean).length;
  if (channelCount > 0) oneLinerParts.push(`채널 ${channelCount}/5`);

  const titleParts: string[] = [];
  if (s.sigungu) titleParts.push(s.sigungu);
  if (dong) titleParts.push(dong);

  // 디지털 점수
  const digital = (() => {
    let score = 0;
    if (s.naver_url) score += 15;
    score += 10;
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

  // 뱃지 — 모든 매물은 일단 "잠재매물". 매도 시그널이 매우 강하면 추가 뱃지.
  const badges: ListingBadge[] = [];
  // potential은 status로 표시, 뱃지로는 별도 표기 안 함 (UI에서 처리)

  // listed_at — 실 first_seen_at이 없으니 null 처리, UI에서 "수집 시점"으로
  const listedAt = new Date("2026-04-23").toISOString();

  return {
    id: `PIL-${s.kakao_place_id}`,
    studio_id: s.kakao_place_id,
    status,
    badges,
    title: titleParts.join(" · ") || s.place_name,
    one_liner: oneLinerParts.join(" · ") || "정보 수집 중",
    sido: s.sido,
    sigungu: s.sigungu,
    dong,
    full_address: null,
    lng: s.lng,
    lat: s.lat,
    // === 실데이터 없음 — null 유지 (UI에서 "—" 또는 hide) ===
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
    // === 진짜 데이터 ===
    studio: s,
    digital_score: digital,
    digital_grade: digitalGradeOf(digital) as Listing["digital_grade"],
    estimate: est,
    // === 메타 — KV(외부)로 이관 예정. 지금은 0 ===
    view_count: 0,
    fav_count: 0,
    buyer_intent_count: 0,
    last_owner_check_at: null,
    listed_at: listedAt,
  };
}

// 외부 채널 링크 빌더 — 실 데이터만
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

// ---- queries ----

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
    .prepare(`SELECT ${STUDIO_COLS} FROM pilates_studio WHERE kakao_place_id = ? AND is_pilates = 1`)
    .get(kid) as Studio | undefined;
  if (!row) return null;
  return studioToListing(row);
}

export function listAllStudios(limit = 12000): Studio[] {
  return db()
    .prepare(`SELECT ${STUDIO_COLS} FROM pilates_studio WHERE is_pilates = 1 LIMIT ?`)
    .all(limit) as Studio[];
}

let _allCache: Listing[] | null = null;
export function listAllListings(): Listing[] {
  if (_allCache) return _allCache;
  const studios = listAllStudios();
  _allCache = studios.map(studioToListing);
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
  if (typeof filters.keyMoneyMin === "number") rows = rows.filter((l) => l.estimate.key_money.mid >= filters.keyMoneyMin!);
  if (typeof filters.keyMoneyMax === "number") rows = rows.filter((l) => l.estimate.key_money.mid <= filters.keyMoneyMax!);
  if (typeof filters.totalAcqMax === "number") rows = rows.filter((l) => l.estimate.total_acquisition.mid <= filters.totalAcqMax!);
  if (typeof filters.yieldMin === "number") rows = rows.filter((l) => l.estimate.monthly_yield_pct >= filters.yieldMin!);
  if (typeof filters.paybackMax === "number") rows = rows.filter((l) => l.estimate.payback_months_keyMoney <= filters.paybackMax!);
  // 시설 필터 — 진짜 데이터 기반(v2.1엔 모두 false)이라 적용 시 결과 0. 채널 필터로 대체.
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
    intent_sell_count: 0,    // 실제 등록 의향만 — 영속화 후 카운트
    buyer_pool: 0,           // 실제 매수 의향 등록만
    potential_count: all.length,  // 모두 잠재매물 (v2.1)
    claimed_count: 0,
  };
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
