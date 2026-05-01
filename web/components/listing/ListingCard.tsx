import Link from "next/link";
import { Suspense } from "react";
import { Listing } from "@/lib/types";
import { fmtMan } from "@/lib/estimate";
import { PotentialBadge } from "./PotentialBadge";
import { FavButton } from "./FavButton";
import { PhotoMain } from "./PhotoMain";
import { channelsOf } from "@/lib/listings";

const GRADE_COLORS: Record<Listing["digital_grade"], string> = {
  A: "text-emerald-600", B: "text-sky-600", C: "text-amber-600", D: "text-orange-600", F: "text-rose-600",
};
const CHANNEL_DOTS: Record<string, string> = {
  kakao_place: "bg-yellow-500", naver_place: "bg-emerald-500", homepage: "bg-sky-500",
  instagram: "bg-pink-500", naver_blog: "bg-lime-500", kakao_channel: "bg-orange-500",
};
const CHANNEL_LABELS: Record<string, string> = {
  kakao_place: "카카오", naver_place: "네이버", homepage: "홈피",
  instagram: "인스타", naver_blog: "블로그", kakao_channel: "톡채널",
};

function PhotoSkeleton() {
  return <div className="h-32 w-full animate-pulse bg-gray-100 rounded-t-lg" />;
}

export function ListingCard({ listing: l }: { listing: Listing }) {
  const channels = channelsOf(l.studio);
  const reviewSum = (l.studio.kakao_review_count ?? 0) + (l.studio.blog_review_count ?? 0);

  return (
    <Link href={`/listings/${l.id}`}
      className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-400 hover:shadow-md">
      {/* 사진 — 풀폭 */}
      <div className="relative">
        <Suspense fallback={<PhotoSkeleton />}>
          <PhotoMain kakaoPlaceId={l.studio.kakao_place_id} lng={l.lng} lat={l.lat} naverUrl={l.studio.naver_url} alt={l.studio.place_name} sigungu={l.sigungu} size="card" />
        </Suspense>
        <div className="absolute right-2 top-2 z-10">
          <FavButton listingId={l.id} />
        </div>
        <div className="absolute left-2 top-2 z-10">
          <PotentialBadge listing={l} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-[10px] font-mono text-gray-400">{l.id}</div>
          <span className={`text-[10px] font-bold ${GRADE_COLORS[l.digital_grade]}`}>{l.digital_grade}급 · {l.digital_score}/90</span>
        </div>
        <div className="mt-0.5 truncate text-base font-bold text-gray-900">{l.studio.place_name}</div>
        <div className="mt-0.5 truncate text-xs text-gray-600">{[l.sigungu, l.dong].filter(Boolean).join(" · ")}</div>
        <div className="mt-0.5 truncate text-[11px] text-gray-500">{l.studio.road_address_name || l.studio.address_name}</div>

        {/* 채널 보유 미니 칩 */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1">
          {channels.slice(0, 6).map((c) => (
            <span key={c.kind} className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-700">
              <span className={`h-1.5 w-1.5 rounded-full ${CHANNEL_DOTS[c.kind]}`} aria-hidden />
              {CHANNEL_LABELS[c.kind]}
            </span>
          ))}
          {reviewSum > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-700">★ {reviewSum.toLocaleString()}</span>
          ) : null}
        </div>

        {/* 5지표 */}
        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
          <Metric label="권리금" value={fmtMan(l.estimate.key_money.mid)} />
          <Metric label="월매출" value={fmtMan(l.estimate.monthly_revenue.mid)} />
          <Metric label="월순익" value={fmtMan(l.estimate.monthly_profit.mid)} />
          <Metric label="수익률" value={`${l.estimate.monthly_yield_pct}%`} highlight />
          <Metric label="회수기간" value={l.estimate.payback_months_keyMoney >= 999 ? "—" : `${l.estimate.payback_months_keyMoney}개월`} />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
          <span className="text-gray-500">창업비용 추정 <strong className="text-gray-700">{fmtMan(l.estimate.total_acquisition.mid)}</strong></span>
          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">추정</span>
        </div>
      </div>
    </Link>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-md px-2 py-1.5 ${highlight ? "bg-emerald-50" : "bg-gray-50"}`}>
      <div className={`text-[9px] uppercase tracking-wide ${highlight ? "text-emerald-700" : "text-gray-500"}`}>{label}<span className="ml-0.5 text-amber-600">~</span></div>
      <div className={`mt-0.5 text-sm font-bold ${highlight ? "text-emerald-900" : "text-gray-900"}`}>{value}</div>
    </div>
  );
}
