// pilaos marketplace types — v2

export type Studio = {
  kakao_place_id: string;
  place_name: string;
  category_name: string | null;
  phone: string | null;
  road_address_name: string | null;
  address_name: string | null;
  sido: string | null;
  sigungu: string | null;
  lng: number;
  lat: number;
  place_url: string | null;

  naver_url: string | null;

  homepage_url: string | null;
  instagram_handle: string | null;
  naver_blog_handle: string | null;
  kakao_channel_name: string | null;
  kakao_channel_url: string | null;

  kakao_review_count: number | null;
  kakao_review_score: number | null;
  kakao_photo_count: number | null;
  blog_review_count: number | null;
  menu_count: number | null;
  menu_price_min: number | null;
  menu_price_max: number | null;
  has_coupon: number | null;
};

export type ScoreBreakdown = {
  total: number;
  grade: "A" | "B" | "C" | "D" | "F";
  platform: { naver: number; kakao: number; kakao_channel: number; total: number };
  digital: { homepage: number; instagram: number; naver_blog: number; total: number };
  content: { kakao_review: number; blog_review: number; menu: number; total: number };
  missing: string[];
  strong: string[];
};

// === marketplace types ===

export type ConfidenceLevel = "verified" | "owner" | "estimate" | "reference";

export type ListingBadge =
  | "urgent"        // 긴급매각
  | "price_cut"     // 가격인하
  | "new"           // 신규등록
  | "verified"      // pilaos 검증 매물
  | "owner_direct"  // 직거래
  | "agent"         // 중개거래
  | "premium";      // 최상단 광고

export type ListingStatus =
  | "cold"          // 공개 데이터로만 채워진 잠재 매물 (원장 미인증)
  | "claimed"       // 원장 인증 완료, 의향 미선택
  | "intent_sell"   // 매도 의향 등록
  | "intent_close"  // 폐업 의향 등록
  | "engaged"       // NDA 체결, 진행 중
  | "closed"        // 거래 완료
  | "withdrawn";    // 매물 철회

export type SellReason = "health" | "relocation" | "expansion" | "liquidation" | "other";

export type Brand = {
  slug: string;
  name: string;
  aliases: string[];
  parent?: string;
  notes?: string;
};

export type EstimateRange = { low: number; mid: number; high: number };

export type ListingEstimate = {
  // 단위: 만원
  monthly_revenue: EstimateRange;
  monthly_profit: EstimateRange;
  key_money: EstimateRange;
  monthly_rent: EstimateRange;
  deposit: EstimateRange;
  member_count: EstimateRange;
  total_acquisition: EstimateRange; // 권리금+보증금+예비운영비
  // 5대 카드 지표
  monthly_yield_pct: number;        // 월수익률 (월순익/총인수가 × 100)
  payback_months_keyMoney: number;  // 권리금 회수기간 (월)
  payback_months_total: number;     // 총투자 회수기간 (월)
  annual_roi_pct: number;
  // 멀티플
  multiple_used: number;
  // 신뢰
  confidence: ConfidenceLevel;
  confidence_score: number; // 0~1
  // 매도 시그널
  sell_signal_score: number; // 0~100
};

export type Listing = {
  id: string; // PIL-{sigungu}-{seq}
  studio_id: string; // kakao_place_id
  status: ListingStatus;
  badges: ListingBadge[];
  // 식별
  title: string; // 자동 생성: "역세권 · 75평 · 리포머 8대"
  one_liner: string; // "강남 역세권 · 재등록률 우수"
  // 위치
  sido: string | null;
  sigungu: string | null;
  dong: string | null; // 도로명/지번에서 추출
  full_address: string | null; // NDA 후 노출
  lng: number;
  lat: number;
  // 물건
  area_m2: number | null;
  area_pyeong: number | null;
  floor: string | null;
  brand_slug: string | null;
  // 시설(휴리스틱)
  reformer_count: number | null;
  group_room: number | null;
  private_room: number | null;
  has_shower: boolean;
  has_parking: boolean;
  has_sauna: boolean;
  has_flying: boolean;
  has_barre: boolean;
  // 디지털
  studio: Studio;
  digital_score: number;
  digital_grade: "A" | "B" | "C" | "D" | "F";
  // 추정
  estimate: ListingEstimate;
  // 메타
  view_count: number;
  fav_count: number;
  buyer_intent_count: number;
  last_owner_check_at: string | null;
  listed_at: string; // ISO
};

// === intents ===

export type IntentKind = "sell" | "acquire" | "start" | "close" | "inquire" | "buyer" | "seller";

export type IntentBase = {
  kind: IntentKind;
  contact_name: string;
  contact_phone: string;
  message?: string;
};

export type SellIntent = IntentBase & {
  kind: "sell";
  listing_id: string;
  asking_key_money?: number;
  flexible: boolean;
  anonymous: boolean;
  timing: "immediate" | "1m" | "3m" | "6m" | "later";
  reason: SellReason;
};

export type AcquireIntent = IntentBase & {
  kind: "acquire";
  region_filters: string[]; // sigungu names
  budget_total: number; // 만원
  budget_key_money_max?: number;
  min_area_pyeong?: number;
  min_reformer?: number;
  capital_proof?: string; // url
  experience: "owner" | "instructor" | "investor" | "first_time";
  urgency: "this_month" | "1q" | "2q" | "later";
};

export type StartIntent = IntentBase & {
  kind: "start";
  region_filters: string[];
  budget_total: number;
  preferred_size_pyeong?: number;
  preferred_concept?: string;
  timing: "1m" | "3m" | "6m" | "1y";
};

export type CloseIntent = IntentBase & {
  kind: "close";
  listing_id: string;
  lease_remaining_months?: number;
  active_member_count?: number;
  issues: string[]; // ["임대인 미협조", "회원 환급 부담", ...]
  preferred_outcome: "transfer_first" | "shutdown_only";
};

export type GeneralInquiry = IntentBase & {
  kind: "inquire";
  intent_type: "sell" | "acquire" | "start" | "close";
  role: ("owner" | "instructor" | "investor" | "buyer" | "general")[];
  sido?: string;
  sigungu?: string;
  listing_id?: string;
};

/** v5.4 매수자 lead — 갈래 A(매물 첨부) / 갈래 B(조건만) / 갈래 C(♥ 모음) */
export type BuyerIntent = IntentBase & {
  kind: "buyer";
  /** matched=특정 매물에 관심 / open=조건만 / favs=♥모음 */
  mode: "matched" | "open" | "favs";
  listing_id?: string;
  fav_listing_ids?: string[];
  role: ("instructor" | "owner" | "first_time" | "investor")[];
  sido?: string;
  sigungu?: string;
  /** 우선순위 1~2개 */
  priorities?: ("region" | "price" | "yield" | "facility" | "operating")[];
  /** 자금 (만원) */
  capital_cash?: number;
  capital_loan?: number;
  /** 시기 */
  timing: "now" | "3m" | "6m" | "later";
  /** 강사 자격 */
  instructor_qualified?: boolean;
  source?: string;  // "home" | "listing" | "favs_modal" | "match_form"
};

/** v5.4 매도자 단순 claim */
export type SellerClaim = IntentBase & {
  kind: "seller";
  listing_id?: string;
  place_name?: string;
  sido?: string;
  sigungu?: string;
  area_pyeong?: number;
  deposit?: number;       // 만원
  monthly_rent?: number;  // 만원
  asking_key_money?: number; // 만원
  sell_reason: "health" | "relocation" | "expansion" | "liquidation" | "other";
  timing: "immediate" | "1m" | "3m" | "6m" | "later";
};

export type Intent = SellIntent | AcquireIntent | StartIntent | CloseIntent | GeneralInquiry | BuyerIntent | SellerClaim;


// === marketplace meta ===

export type ListingVisibility =
  | "potential"   // Kakao 시드만, 주인 미등록
  | "claimed"     // 주인이 등록함 (인증 미)
  | "verified";   // pilaos 운영팀 본인확인 + 자료 검증 완료

export type ChannelLink = {
  kind: "naver_place" | "kakao_place" | "kakao_channel" | "homepage" | "instagram" | "naver_blog";
  label: string;
  url: string;
  has_data: boolean;
};
