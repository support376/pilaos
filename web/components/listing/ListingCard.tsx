import Link from "next/link";
import { Suspense } from "react";
import { Listing } from "@/lib/types";
import { fmtMan } from "@/lib/estimate";
import { FavButton } from "./FavButton";
import { PhotoMain } from "./PhotoMain";

function PhotoSkeleton() {
  return <div className="aspect-[16/10] w-full animate-pulse bg-black/5" />;
}

export function ListingCard({ listing: l }: { listing: Listing }) {
  const reviewSum = (l.studio.kakao_review_count ?? 0) + (l.studio.blog_review_count ?? 0);
  const noFee = l.estimate.key_money.mid <= 500;

  return (
    <Link href={`/listings/${l.id}`}
      className="group relative block overflow-hidden rounded-xl border border-black/10 bg-white transition hover:border-black hover:shadow-sm">
      {/* 사진 */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
        <Suspense fallback={<PhotoSkeleton />}>
          <PhotoMain kakaoPlaceId={l.studio.kakao_place_id} lng={l.lng} lat={l.lat} naverUrl={l.studio.naver_url} alt={l.studio.place_name} sigungu={l.sigungu} size="card" />
        </Suspense>

        <div className="absolute right-3 top-3 z-10">
          <FavButton listingId={l.id} />
        </div>

        {noFee ? (
          <div className="absolute left-3 top-3 z-10 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">무권리 추정</div>
        ) : null}
      </div>

      {/* 정보 */}
      <div className="p-4">
        <div className="truncate text-[15px] font-extrabold text-black">{l.studio.place_name}</div>
        <div className="mt-0.5 truncate text-[12px] text-black/65">{[l.sigungu, l.dong].filter(Boolean).join(" · ")}</div>

        {/* 핵심 3 지표 - 깔끔한 행 */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-black/10 pt-3">
          <Cell label="권리금" value={noFee ? "무권리" : fmtMan(l.estimate.key_money.mid)} highlight={noFee} />
          <Cell label="월매출" value={fmtMan(l.estimate.monthly_revenue.mid)} />
          <Cell label="월수익률" value={`${l.estimate.monthly_yield_pct}%`} highlight={l.estimate.monthly_yield_pct >= 7} />
        </div>

        {/* 부가 정보 한 줄 */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-black/55">
          <span>총 인수가 <strong className="text-black/85">{fmtMan(l.estimate.total_acquisition.mid)}</strong></span>
          {reviewSum > 0 ? <span>★ {reviewSum.toLocaleString()}</span> : null}
        </div>
      </div>
    </Link>
  );
}

function Cell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-black/45 uppercase">{label}</div>
      <div className={`mt-0.5 text-[14px] font-extrabold ${highlight ? "text-blue-600" : "text-black"}`}>{value}</div>
    </div>
  );
}
