import Link from "next/link";
import { Listing } from "@/lib/types";
import { fmtMan } from "@/lib/estimate";
import { BadgeStack } from "./BadgeStack";
import { MetricStack } from "./MetricStack";

const GRADE_COLORS: Record<Listing["digital_grade"], string> = {
  A: "text-emerald-600", B: "text-sky-600", C: "text-amber-600", D: "text-orange-600", F: "text-rose-600",
};

export function ListingCard({ listing }: { listing: Listing }) {
  const l = listing;
  const lastCheck = l.last_owner_check_at ? new Date(l.last_owner_check_at) : null;
  const daysSince = lastCheck ? Math.floor((Date.now() - lastCheck.getTime()) / (1000 * 3600 * 24)) : null;
  return (
    <Link
      href={`/listings/${l.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-400 hover:shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-24 w-full flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400 sm:h-20 sm:w-32">
          {l.studio.kakao_photo_count ? `사진 ${l.studio.kakao_photo_count}장` : "사진 미등록"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5">
            <BadgeStack badges={l.badges} />
          </div>
          <div className="text-[11px] text-gray-400 font-mono">{l.id}</div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <h3 className="truncate text-base font-bold text-gray-900">{l.studio.place_name}</h3>
            <span className={`text-xs font-bold ${GRADE_COLORS[l.digital_grade]}`}>{l.digital_grade}급</span>
          </div>
          <div className="mt-0.5 truncate text-xs text-gray-600">{l.title}</div>
          <div className="mt-0.5 truncate text-xs text-gray-500">{l.one_liner}</div>
        </div>
      </div>
      <div className="mt-3 border-t border-gray-100 pt-3">
        <MetricStack listing={l} compact />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
        <span>창업비용 {fmtMan(l.estimate.total_acquisition.mid)} · 보증금 {fmtMan(l.estimate.deposit.mid)} · 월세 {fmtMan(l.estimate.monthly_rent.mid)}</span>
        <span className="flex items-center gap-2">
          {l.buyer_intent_count > 0 ? (
            <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">매수자 {l.buyer_intent_count}명 대기</span>
          ) : null}
          <span>조회 {l.view_count.toLocaleString()}</span>
          {daysSince !== null ? <span>· 주인확인 {daysSince === 0 ? "오늘" : `${daysSince}일 전`}</span> : null}
        </span>
      </div>
    </Link>
  );
}
