import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getListing, sigunguMarketStats, similarListings } from "@/lib/listings";
import { fmtMan } from "@/lib/estimate";
import { brandBySlug } from "@/lib/brands";
import { ListingCard } from "@/components/listing/ListingCard";
import { ConfidencePill } from "@/components/listing/ConfidencePill";
import { PotentialBadge } from "@/components/listing/PotentialBadge";
import { FavButton } from "@/components/listing/FavButton";
import { InlineLeadForm } from "@/components/listing/InlineLeadForm";
import { ChannelLinks } from "@/components/listing/ChannelLinks";
import { EstimateNote } from "@/components/listing/EstimateNote";
import { EstimateBasis } from "@/components/listing/EstimateBasis";
import { PhotoMain } from "@/components/listing/PhotoMain";
import { InterestCounter } from "@/components/listing/InterestCounter";

type Params = { params: Promise<{ id: string }> };

export default async function ListingPage({ params }: Params) {
  const { id } = await params;
  const l = getListing(id);
  if (!l) return notFound();
  const e = l.estimate;
  const s = l.studio;
  const brand = l.brand_slug ? brandBySlug(l.brand_slug) : null;
  const market = (l.sido && l.sigungu) ? sigunguMarketStats(l.sido, l.sigungu) : null;
  const similar = similarListings(l, 4);

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 sm:py-8 bg-white">
      {/* 빵부스러기 */}
      <div className="mb-4 flex items-center gap-2 text-xs text-black/55">
        <Link href="/listings" className="hover:text-black">매물 검색</Link>
        <span className="text-black/30">/</span>
        {l.sigungu ? <Link href={`/listings?sigungu=${encodeURIComponent(l.sigungu)}`} className="hover:text-black">{l.sigungu}</Link> : null}
        <span className="text-black/30">/</span>
        <span className="text-black/85 font-mono text-[11px]">{l.id}</span>
      </div>

      {/* HERO 사진 + 핵심 지표 */}
      <section className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <Suspense fallback={<div className="h-64 w-full animate-pulse bg-black/5 sm:h-80" />}>
          <PhotoMain kakaoPlaceId={s.kakao_place_id} lng={l.lng} lat={l.lat} naverUrl={s.naver_url} sigungu={l.sigungu} alt={s.place_name} size="hero" />
        </Suspense>

        <div className="p-5 sm:p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <PotentialBadge listing={l} size="md" />
            <span className="text-[11px] font-mono text-black/40">{l.id}</span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight">{s.place_name}</h1>
              <p className="mt-1 text-sm text-black/75">{[l.sigungu, l.dong].filter(Boolean).join(" · ")}</p>
              <p className="mt-0.5 text-xs text-black/50">{s.road_address_name || s.address_name}{brand ? ` · ${brand.name}` : ""}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <FavButton listingId={l.id} variant="hero" />
              <Suspense fallback={null}><InterestCounter listingId={l.id} /></Suspense>
            </div>
          </div>

          {/* 5 핵심 지표 */}
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              { label: "권리금", v: fmtMan(e.key_money.mid), s: `${fmtMan(e.key_money.low)}~${fmtMan(e.key_money.high)}` },
              { label: "월매출", v: fmtMan(e.monthly_revenue.mid), s: `${fmtMan(e.monthly_revenue.low)}~${fmtMan(e.monthly_revenue.high)}` },
              { label: "월순익", v: fmtMan(e.monthly_profit.mid), s: `${fmtMan(e.monthly_profit.low)}~${fmtMan(e.monthly_profit.high)}` },
              { label: "월수익률", v: `${e.monthly_yield_pct}%`, s: `연 ROI ${e.annual_roi_pct}%` },
              { label: "회수기간", v: e.payback_months_keyMoney >= 999 ? "—" : `${e.payback_months_keyMoney}개월`, s: e.payback_months_total >= 999 ? "" : `총투자 ${e.payback_months_total}개월` },
            ].map((it) => (
              <div key={it.label} className="rounded-lg bg-black/[.03] px-3 py-2.5">
                <div className="text-[10px] uppercase font-bold text-black/45">{it.label} <span className="text-blue-600">~</span></div>
                <div className="mt-0.5 text-base sm:text-lg font-extrabold text-black">{it.v}</div>
                <div className="text-[10px] text-black/40">{it.s}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ConfidencePill level={e.confidence} />
            <span className="text-[11px] text-black/55">신뢰도 {Math.round(e.confidence_score * 100)}%</span>
            <span className="text-black/25">·</span>
            <span className="text-[11px] text-black/55">멀티플 {e.multiple_used}x</span>
            <span className="text-black/25">·</span>
            <span className="text-[11px] text-black/55">디지털 {l.digital_grade}급</span>
          </div>

          <EstimateNote listing={l} />
          <EstimateBasis listing={l} />
        </div>
      </section>

      {/* 매수자 신청 - 즉시 진입 */}
      <section className="mt-5">
        <InlineLeadForm listingId={l.id} placeName={l.studio.place_name} />
      </section>

      {/* 잠재매물 안내 */}
      <section className="mt-5 rounded-xl border border-black/10 bg-black/[.03] p-4">
        <div className="text-[12px] font-bold text-black/85">잠재매물입니다</div>
        <p className="mt-1 text-[12px] text-black/65 leading-relaxed">
          이 매물은 카카오·네이버 공개 데이터로 자동 발굴된 잠재매물입니다. 매수 의향을 등록하시면 운영팀이 매도 의사 확인 컨택을 진행합니다.
        </p>
      </section>

      {/* 디지털 운영 점수 — 우리 차별점 */}
      <section className="mt-6 rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">우리 차별점</div>
        <div className="mt-2 flex items-baseline justify-between">
          <h2 className="text-lg font-extrabold">디지털 운영 점수</h2>
          <div className="text-right">
            <div className="text-[28px] font-extrabold text-blue-600 leading-none">{l.digital_score}<span className="text-sm text-black/50">/90</span></div>
            <div className="mt-0.5 text-[11px] font-bold text-black/55">{l.digital_grade}급</div>
          </div>
        </div>
        <p className="mt-2 text-[12px] text-black/60 leading-relaxed">디지털 채널 운영, 리뷰 수, 메뉴·가격 등록 등을 종합한 점수입니다.</p>
        <div className="mt-4">
          <ChannelLinks studio={s} />
        </div>
        {(s.kakao_review_count ?? 0) > 0 || (s.blog_review_count ?? 0) > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-black/65">
            {(s.kakao_review_count ?? 0) > 0 ? <span>카카오맵 ★ {s.kakao_review_score?.toFixed(1) ?? "-"} <strong className="text-black">({s.kakao_review_count?.toLocaleString()})</strong></span> : null}
            {(s.blog_review_count ?? 0) > 0 ? <span>블로그 후기 <strong className="text-black">{s.blog_review_count?.toLocaleString()}</strong>건</span> : null}
            {(s.menu_count ?? 0) > 0 ? <span>메뉴 <strong className="text-black">{s.menu_count}</strong>건 · {s.menu_price_min?.toLocaleString()}~{s.menu_price_max?.toLocaleString()}원</span> : null}
          </div>
        ) : null}
      </section>

      {/* 시군구 시세 비교 */}
      {market ? (
        <section className="mt-6 rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">{l.sigungu} 시세 비교</h2>
          <p className="mt-1 text-xs text-black/55">동일 시군구 {market.n}곳 추정 분포</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Compare label="권리금" mid={e.key_money.mid} p25={market.key_p25} p50={market.key_p50} p75={market.key_p75} fmt={fmtMan} />
            <Compare label="월매출" mid={e.monthly_revenue.mid} p25={market.rev_p25} p50={market.rev_p50} p75={market.rev_p75} fmt={fmtMan} />
            <Compare label="월수익률" mid={e.monthly_yield_pct} p25={market.yield_p25} p50={market.yield_p50} p75={market.yield_p75} fmt={(n) => `${n}%`} />
          </div>
          {l.sido && l.sigungu ? (
            <Link href={`/listings?sigungu=${encodeURIComponent(l.sigungu)}`} className="mt-4 inline-block text-xs font-bold text-blue-600 underline underline-offset-4">같은 지역 매물 보기 →</Link>
          ) : null}
        </section>
      ) : null}

      {/* 위치·연락 */}
      <section className="mt-6 rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-extrabold">위치 · 기본 정보</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-black/[.03] p-4 text-sm">
            <div className="text-[11px] font-bold text-black/55 uppercase">주소</div>
            <div className="mt-1 font-bold text-black">{l.sido} {l.sigungu} {l.dong ?? ""}</div>
            <div className="mt-1 text-[12px] text-black/65">{s.road_address_name || s.address_name}</div>
            {s.phone ? <div className="mt-2 text-[12px] text-black/65">📞 {s.phone}</div> : null}
          </div>
          <div className="rounded-lg bg-black/[.03] p-4 text-sm">
            <div className="text-[11px] font-bold text-black/55 uppercase">매도 시그널</div>
            <div className="mt-1 text-base font-extrabold text-black">{e.sell_signal_score}/100점</div>
            <div className="mt-1 text-[12px] text-black/65">디지털 활성도 + 리뷰 추세 + 운영 시간 종합</div>
          </div>
        </div>
      </section>

      {/* 비슷한 매물 */}
      {similar.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-extrabold">비슷한 매물</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {similar.map((x) => <ListingCard key={x.id} listing={x} />)}
          </div>
        </section>
      ) : null}

      {/* 매도자 claim 영역 — 작게, 매수자 시야 밖 */}
      <section className="mt-10 rounded-xl border border-black/10 bg-black/[.02] p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[12px] font-bold text-black/85">이 학원의 운영자세요?</div>
            <div className="mt-0.5 text-[11px] text-black/55">매도 의향을 직접 등록하시거나, 노출 거부를 신청할 수 있어요.</div>
          </div>
          <div className="flex gap-2">
            <Link href={`/inquire?listing=${encodeURIComponent(l.id)}&kind=sell`} className="rounded-md border border-black/15 bg-white px-3 py-1.5 text-[11px] font-bold text-black hover:bg-black/5">매도 등록</Link>
            <Link href={`/listings/${l.id}/takedown`} className="rounded-md border border-black/15 bg-white px-3 py-1.5 text-[11px] font-bold text-black/55 hover:bg-black/5">노출 거부</Link>
          </div>
        </div>
      </section>

      {/* 안내 */}
      <section className="mt-6 text-center text-[11px] text-black/45">
        <p>이 매물은 카카오·네이버 공개 데이터 기반의 잠재매물이며 모든 숫자는 추정값입니다.</p>
      </section>
    </div>
  );
}

function Compare({ label, mid, p25, p50, p75, fmt }: { label: string; mid: number; p25: number; p50: number; p75: number; fmt: (n: number) => string }) {
  const cmp = mid >= p75 ? "상위" : mid >= p50 ? "중상" : mid >= p25 ? "중하" : "하위";
  const cmpColor = mid >= p50 ? "text-blue-600" : "text-black/55";
  return (
    <div className="rounded-lg border border-black/10 bg-white p-3.5">
      <div className="text-[11px] font-bold text-black/55">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-base font-extrabold text-black">{fmt(mid)}</span>
        <span className={`text-[11px] font-bold ${cmpColor}`}>{cmp}</span>
      </div>
      <div className="mt-2 text-[11px] text-black/50">p25 {fmt(p25)} · p50 {fmt(p50)} · p75 {fmt(p75)}</div>
    </div>
  );
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const l = getListing(id);
  if (!l) return { title: "매물을 찾을 수 없습니다" };
  return {
    title: `${l.studio.place_name} · ${l.sigungu ?? ""} · 권리금 ${fmtMan(l.estimate.key_money.mid)} 추정`,
    description: `잠재매물 — ${[l.sigungu, l.dong].filter(Boolean).join(" · ")}. 추정 권리금 ${fmtMan(l.estimate.key_money.mid)}, 월수익률 ${l.estimate.monthly_yield_pct}%.`,
    robots: { index: true, follow: true },
  };
}
