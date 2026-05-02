import Link from "next/link";
import { Suspense } from "react";
import { Listing } from "@/lib/types";
import { fmtMan } from "@/lib/estimate";
import { PotentialBadge } from "./PotentialBadge";
import { FavButton } from "./FavButton";
import { PhotoMain } from "./PhotoMain";
import { ChannelDots } from "./ChannelLinks";

const GRADE_COLORS: Record<Listing["digital_grade"], string> = {
  A: "text-emerald-600", B: "text-sky-600", C: "text-amber-600", D: "text-orange-600", F: "text-rose-600",
};

function PhotoSkeleton() {
  return <div className="h-48 w-full animate-pulse bg-gray-100" />;
}

export function ListingCard({ listing: l }: { listing: Listing }) {
  const reviewSum = (l.studio.kakao_review_count ?? 0) + (l.studio.blog_review_count ?? 0);

  return (
    <Link href={`/listings/${l.id}`}
      className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-400 hover:shadow-md">
      {/* 사진 — 풀폭 큰 사이즈 */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Suspense fallback={<PhotoSkeleton />}>
          <PhotoMain kakaoPlaceId={l.studio.kakao_place_id} lng={l.lng} lat={l.lat} naverUrl={l.studio.naver_url} alt={l.studio.place_name} sigungu={l.sigungu} size="card" />
        </Suspense>

        {/* 좌상단: 잠재매물 배지 */}
        <div className="absolute left-3 top-3 z-10">
          <PotentialBadge listing={l} />
        </div>
        {/* 우상단: 찜 */}
        <div className="absolute right-3 top-3 z-10">
          <FavButton listingId={l.id} />
        </div>
        {/* 좌하단: 권리금 가격 오버레이 */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="rounded-lg bg-black/65 px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[9px] uppercase tracking-wide text-amber-200/90">권리금 추정</div>
            <div className="text-base font-bold text-white">{l.estimate.key_money.mid <= 500 ? "무권리" : fmtMan(l.estimate.key_money.mid)}</div>
          </div>
        </div>
        {/* 우하단: 수익률 */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="rounded-lg bg-emerald-600/90 px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[9px] uppercase tracking-wide text-white/85">월수익률</div>
            <div className="text-base font-bold text-white">{l.estimate.monthly_yield_pct}%</div>
          </div>
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

        {/* 채널 아이콘 + 리뷰 */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <ChannelDots studio={l.studio} />
          {reviewSum > 0 ? (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-gray-500">★ {reviewSum.toLocaleString()}</span>
          ) : null}
        </div>

        {/* 5지표 — 권리금/수익률은 위에 오버레이로 빠졌으니 나머지 3지표 */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <Metric label="월매출" value={fmtMan(l.estimate.monthly_revenue.mid)} />
          <Metric label="월순익" value={fmtMan(l.estimate.monthly_profit.mid)} />
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-gray-50 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wide text-gray-500">{label}<span className="ml-0.5 text-amber-600">~</span></div>
      <div className="mt-0.5 text-sm font-bold text-gray-900">{value}</div>
    </div>
  );
}
