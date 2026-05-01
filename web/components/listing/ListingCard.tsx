import Link from "next/link";
import { Listing } from "@/lib/types";
import { fmtMan } from "@/lib/estimate";
import { PotentialBadge } from "./PotentialBadge";
import { FavButton } from "./FavButton";
import { channelsOf } from "@/lib/listings";

const GRADE_COLORS: Record<Listing["digital_grade"], string> = {
  A: "text-emerald-600", B: "text-sky-600", C: "text-amber-600", D: "text-orange-600", F: "text-rose-600",
};

const CHANNEL_DOTS: Record<string, string> = {
  kakao_place: "bg-yellow-500",
  naver_place: "bg-emerald-500",
  homepage: "bg-sky-500",
  instagram: "bg-pink-500",
  naver_blog: "bg-lime-500",
  kakao_channel: "bg-orange-500",
};

const CHANNEL_LABELS: Record<string, string> = {
  kakao_place: "카카오",
  naver_place: "네이버",
  homepage: "홈피",
  instagram: "인스타",
  naver_blog: "블로그",
  kakao_channel: "톡채널",
};

export function ListingCard({ listing: l }: { listing: Listing }) {
  const channels = channelsOf(l.studio);
  const reviewSum = (l.studio.kakao_review_count ?? 0) + (l.studio.blog_review_count ?? 0);

  return (
    <Link
      href={`/listings/${l.id}`}
      className="group relative block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-400 hover:shadow-sm"
    >
      <div className="absolute right-3 top-3 z-10">
        <FavButton listingId={l.id} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {/* 사진 placeholder — 외부 채널 안내 */}
        <div className="flex h-24 w-full shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center text-[11px] text-gray-500 sm:h-24 sm:w-32">
          {channels.length > 0 ? (
            <>
              <div className="text-xs font-bold text-gray-700">사진 보기</div>
              <div className="text-[10px] text-gray-500">상세 → 외부 채널</div>
            </>
          ) : (
            <span>정보 수집 중</span>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-8">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <PotentialBadge listing={l} />
            <span className={`text-[10px] font-bold ${GRADE_COLORS[l.digital_grade]}`}>{l.digital_grade}급 · {l.digital_score}/90</span>
          </div>
          <div className="text-[10px] font-mono text-gray-400">{l.id}</div>
          <div className="mt-0.5 truncate text-base font-bold text-gray-900">{l.studio.place_name}</div>
          <div className="mt-0.5 truncate text-xs text-gray-600">{[l.sigungu, l.dong].filter(Boolean).join(" · ")}</div>
          <div className="mt-0.5 truncate text-[11px] text-gray-500">{l.studio.road_address_name || l.studio.address_name}</div>
        </div>
      </div>

      {/* 채널 보유 미니 칩 */}
      <div className="mt-3 flex flex-wrap items-center gap-1">
        {channels.slice(0, 6).map((c) => (
          <span key={c.kind} className={`inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-700`}>
            <span className={`h-1.5 w-1.5 rounded-full ${CHANNEL_DOTS[c.kind]}`} aria-hidden />
            {CHANNEL_LABELS[c.kind]}
          </span>
        ))}
        {reviewSum > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-700">
            ★ 리뷰 {reviewSum.toLocaleString()}
          </span>
        ) : null}
      </div>

      {/* 5지표 — 추정값 명시 */}
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        <Metric label="권리금" value={fmtMan(l.estimate.key_money.mid)} estimate />
        <Metric label="월매출" value={fmtMan(l.estimate.monthly_revenue.mid)} estimate />
        <Metric label="월순익" value={fmtMan(l.estimate.monthly_profit.mid)} estimate />
        <Metric label="월수익률" value={`${l.estimate.monthly_yield_pct}%`} estimate />
        <Metric label="회수기간" value={l.estimate.payback_months_keyMoney >= 999 ? "—" : `${l.estimate.payback_months_keyMoney}개월`} estimate />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
        <span>창업비용 추정 {fmtMan(l.estimate.total_acquisition.mid)}</span>
        <span aria-hidden>·</span>
        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">추정</span>
      </div>
    </Link>
  );
}

function Metric({ label, value, estimate }: { label: string; value: string; estimate?: boolean }) {
  return (
    <div className="rounded-md bg-gray-50 px-2.5 py-1.5">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-gray-500">
        {label}
        {estimate ? <span className="text-amber-600">~</span> : null}
      </div>
      <div className="mt-0.5 text-sm font-bold text-gray-900">{value}</div>
    </div>
  );
}
