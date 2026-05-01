// Listing 계층 — pilates_studio 위에 구축한 가상 listing 엔티티
// SQLite는 readonly. listing 메타(view_count, badges 등)는
// 데이터베이스 추가 컬럼이 아니라 결정적 함수로 derive.

import { db } from "./db";
import { Studio, Listing, ListingBadge, ListingStatus } from "./types";
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

// 결정적 시드 — kakao_place_id 해시로 메타값 생성
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function deriveListingMeta(s: Studio): {
  area_m2: number;
  area_pyeong: number;
  floor: string;
  reformer_count: number;
  group_room: number;
  private_room: number;
  has_shower: boolean;
  has_parking: boolean;
  has_sauna: boolean;
  has_flying: boolean;
  has_barre: boolean;
  view_count: number;
  fav_count: number;
  buyer_intent_count: number;
} {
  const h = hashCode(s.kakao_place_id);
  const sigunguMult: Record<string, number> = {
    "강남구": 1.4, "서초구": 1.3, "송파구": 1.2, "마포구": 1.1, "분당구": 1.2,
  };
  const mult = (s.sigungu && sigunguMult[s.sigungu]) || 1.0;
  // 면적: 30~120평 (99~396m²) — 활동량 기반
  const reviews = (s.kakao_review_count ?? 0) + (s.blog_review_count ?? 0);
  const baseAreaPy = 35 + (reviews * 0.3) + ((h % 50)) + (mult - 1) * 20;
  const areaPyeong = Math.max(15, Math.min(120, Math.round(baseAreaPy)));
  const areaM2 = Math.round(areaPyeong * 3.305);
  const floors = ["1F", "2F", "3F", "4F", "5F", "B1", "지상6F"];
  const floor = floors[h % floors.length];
  const reformer = Math.max(3, Math.min(14, Math.round(areaPyeong / 8)));
  const group = (h % 4 < 2) ? 2 : 1;
  const priv = Math.max(1, Math.min(4, Math.round(reformer / 6)));
  return {
    area_m2: areaM2,
    area_pyeong: areaPyeong,
    floor,
    reformer_count: reformer,
    group_room: group,
    private_room: priv,
    has_shower: (h % 3) !== 0,
    has_parking: (h >> 3) % 4 !== 0,
    has_sauna: (h >> 5) % 7 === 0,
    has_flying: (h >> 7) % 5 === 0,
    has_barre: (h >> 11) % 4 === 0,
    view_count: 50 + (h % 4000),
    fav_count: (h >> 13) % 80,
    buyer_intent_count: ((h >> 17) % 25),
  };
}

function deriveBadges(s: Studio, sellSignal: number, h: number): ListingBadge[] {
  const out: ListingBadge[] = [];
  if (sellSignal >= 80) out.push("urgent");
  if ((h % 11) === 0) out.push("price_cut");
  if ((h % 17) === 1) out.push("new");
  if ((h % 7) === 0) out.push("verified");
  // 직거래/중개거래
  if ((h % 5) < 2) out.push("owner_direct");
  else out.push("agent");
  if ((h % 23) === 3) out.push("premium");
  return out;
}

export function studioToListing(s: Studio): Listing {
  const h = hashCode(s.kakao_place_id);
  const meta = deriveListingMeta(s);
  const est = estimateListing({
    studio: s,
    area_m2: meta.area_m2,
    reformer_count: meta.reformer_count,
  });
  const badges = deriveBadges(s, est.sell_signal_score, h);

  // 도/동 추출 (도로명에서 마지막 "동/로/길"의 앞)
  let dong: string | null = null;
  const addr = s.road_address_name || s.address_name || "";
  const m = addr.match(/([가-힣]+동|[가-힣]+가|[가-힣]+로[0-9]*|[가-힣]+길)/);
  if (m) dong = m[1];

  // 한 줄 카피 자동 생성
  const oneLinerParts: string[] = [];
  if (s.sigungu) oneLinerParts.push(s.sigungu);
  if (meta.area_pyeong) oneLinerParts.push(`${meta.area_pyeong}평`);
  oneLinerParts.push(`리포머 ${meta.reformer_count}대`);
  if (meta.has_shower) oneLinerParts.push("샤워실");
  if (meta.has_parking) oneLinerParts.push("주차");

  const titleParts: string[] = [];
  if (s.sigungu) titleParts.push(s.sigungu);
  if (dong) titleParts.push(dong);
  titleParts.push(`${meta.area_pyeong}평`);

  // status: 매도 시그널이 강한 cold → cold 유지, 일부는 시드 데모로 intent_sell 캐스트
  let status: ListingStatus = "cold";
  if ((h % 41) < 3) status = "claimed";
  if ((h % 41) === 4) status = "intent_sell";
  if ((h % 53) === 7) status = "intent_close";

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

  const listedAtBase = new Date("2026-01-01").getTime();
  const listedDay = (h % 120);
  const listedAt = new Date(listedAtBase + listedDay * 24 * 3600 * 1000).toISOString();
  const lastCheckDay = (h % 30);
  const lastCheck = new Date(Date.now() - lastCheckDay * 24 * 3600 * 1000).toISOString();

  return {
    id: `PIL-${s.kakao_place_id}`,
    studio_id: s.kakao_place_id,
    status,
    badges,
    title: titleParts.join(" · "),
    one_liner: oneLinerParts.join(" · "),
    sido: s.sido,
    sigungu: s.sigungu,
    dong,
    full_address: null,
    lng: s.lng,
    lat: s.lat,
    area_m2: meta.area_m2,
    area_pyeong: meta.area_pyeong,
    floor: meta.floor,
    brand_slug: brandFromName(s.place_name),
    reformer_count: meta.reformer_count,
    group_room: meta.group_room,
    private_room: meta.private_room,
    has_shower: meta.has_shower,
    has_parking: meta.has_parking,
    has_sauna: meta.has_sauna,
    has_flying: meta.has_flying,
    has_barre: meta.has_barre,
    studio: s,
    digital_score: digital,
    digital_grade: digitalGradeOf(digital) as Listing["digital_grade"],
    estimate: est,
    view_count: meta.view_count,
    fav_count: meta.fav_count,
    buyer_intent_count: meta.buyer_intent_count,
    last_owner_check_at: lastCheck,
    listed_at: listedAt,
  };
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
  yieldMin?: number;       // %
  paybackMax?: number;     // 개월
  areaMinPy?: number;
  areaMaxPy?: number;
  reformerMin?: number;
  hasParking?: boolean;
  hasShower?: boolean;
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
  // PIL-{kakao_place_id} 형식
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

  // 필터
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
  if (filters.badge) rows = rows.filter((l) => l.badges.includes(filters.badge!));
  if (filters.ownerDirect) rows = rows.filter((l) => l.badges.includes("owner_direct"));
  if (filters.status) rows = rows.filter((l) => l.status === filters.status);
  if (typeof filters.keyMoneyMin === "number") rows = rows.filter((l) => l.estimate.key_money.mid >= filters.keyMoneyMin!);
  if (typeof filters.keyMoneyMax === "number") rows = rows.filter((l) => l.estimate.key_money.mid <= filters.keyMoneyMax!);
  if (typeof filters.totalAcqMax === "number") rows = rows.filter((l) => l.estimate.total_acquisition.mid <= filters.totalAcqMax!);
  if (typeof filters.yieldMin === "number") rows = rows.filter((l) => l.estimate.monthly_yield_pct >= filters.yieldMin!);
  if (typeof filters.paybackMax === "number") rows = rows.filter((l) => l.estimate.payback_months_keyMoney <= filters.paybackMax!);
  if (typeof filters.areaMinPy === "number") rows = rows.filter((l) => (l.area_pyeong ?? 0) >= filters.areaMinPy!);
  if (typeof filters.areaMaxPy === "number") rows = rows.filter((l) => (l.area_pyeong ?? 0) <= filters.areaMaxPy!);
  if (typeof filters.reformerMin === "number") rows = rows.filter((l) => (l.reformer_count ?? 0) >= filters.reformerMin!);
  if (filters.hasParking) rows = rows.filter((l) => l.has_parking);
  if (filters.hasShower) rows = rows.filter((l) => l.has_shower);

  // 정렬
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
      case "owner_check": return new Date(b.last_owner_check_at ?? 0).getTime() - new Date(a.last_owner_check_at ?? 0).getTime();
      case "fav": return b.fav_count - a.fav_count;
      case "views": return b.view_count - a.view_count;
      case "score": return b.digital_score - a.digital_score;
      case "ad":
      default: {
        const adA = a.badges.includes("premium") ? 0 : 1;
        const adB = b.badges.includes("premium") ? 0 : 1;
        if (adA !== adB) return adA - adB;
        return b.digital_score - a.digital_score;
      }
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

  const sellCount = all.filter((l) => l.status === "intent_sell" || l.status === "intent_close").length;
  // 매수자 풀: hash로 시드된 buyer_intent_count 합 / N (가짜 — 실 운영 전 데모용 수치)
  const buyerPool = Math.round(all.reduce((s, l) => s + l.buyer_intent_count, 0) / 50);
  return {
    total: all.length,
    by_sido,
    by_sigungu,
    intent_sell_count: sellCount,
    buyer_pool: buyerPool,
  };
}

export function listingsByBrand(brandSlug: string, limit = 200): Listing[] {
  const all = listAllListings();
  return all.filter((l) => l.brand_slug === brandSlug).slice(0, limit);
}

// 시군구 시세 (mid 분포)
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

// 비슷한 매물 (시군구 + 가격대)
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
