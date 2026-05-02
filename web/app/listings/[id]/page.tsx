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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/listings" className="hover:text-gray-900">매물</Link>
        <span>/</span>
        {l.sigungu ? <Link href={`/listings?sigungu=${encodeURIComponent(l.sigungu)}`} className="hover:text-gray-900">{l.sigungu}</Link> : null}
        <span>/</span>
        <span className="text-gray-700">{l.id}</span>
      </div>

      {/* HERO */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <Suspense fallback={<div className="h-64 w-full animate-pulse bg-gray-100 sm:h-80" />}>
          <PhotoMain kakaoPlaceId={s.kakao_place_id} lng={l.lng} lat={l.lat} naverUrl={s.naver_url} sigungu={l.sigungu} alt={s.place_name} size="hero" />
        </Suspense>

        <div className="p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <PotentialBadge listing={l} size="md" />
            <span className="text-[11px] font-mono text-gray-400">{l.id}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight">{s.place_name}</h1>
              <p className="mt-1 text-sm text-gray-700">{[l.sigungu, l.dong].filter(Boolean).join(" · ")}</p>
              <p className="mt-0.5 text-xs text-gray-500">{s.road_address_name || s.address_name} · 디지털 {l.digital_grade}급 ({l.digital_score}/90){brand ? ` · 브랜드 ${brand.name}` : ""}</p>
            </div>
            <FavButton listingId={l.id} variant="hero" />
            <Suspense fallback={null}><InterestCounter listingId={l.id} /></Suspense>
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">잠재매물입니다</p>
            <p className="mt-1 leading-relaxed text-amber-900/85">
              이 매물은 카카오·네이버 공개 데이터로 자동 수집된 잠재매물입니다. 주인이 등록한 매물이 아니며 권리금·매출 등 모든 숫자는 추정치입니다.
              매수 의향을 등록하시면 운영팀이 매도 의사 확인 컨택을 진행합니다.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: "권리금", v: fmtMan(e.key_money.mid), s: `${fmtMan(e.key_money.low)}~${fmtMan(e.key_money.high)}` },
              { label: "월매출", v: fmtMan(e.monthly_revenue.mid), s: `${fmtMan(e.monthly_revenue.low)}~${fmtMan(e.monthly_revenue.high)}` },
              { label: "월순익", v: fmtMan(e.monthly_profit.mid), s: `${fmtMan(e.monthly_profit.low)}~${fmtMan(e.monthly_profit.high)}` },
              { label: "월수익률", v: `${e.monthly_yield_pct}%`, s: `연 ROI ${e.annual_roi_pct}%` },
              { label: "회수기간", v: e.payback_months_keyMoney >= 999 ? "—" : `${e.payback_months_keyMoney}개월`, s: `총투자 ${e.payback_months_total >= 999 ? "—" : e.payback_months_total + "개월"}` },
            ].map((it) => (
              <div key={it.label} className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="flex items-center gap-1 text-[10px] uppercase text-gray-500">{it.label}<span className="text-amber-600">~</span></div>
                <div className="mt-0.5 text-lg font-bold text-gray-900">{it.v}</div>
                <div className="text-[10px] text-gray-400">{it.s}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ConfidencePill level={e.confidence} />
            <span className="text-[11px] text-gray-500">신뢰도 {Math.round(e.confidence_score * 100)}%</span>
            <span className="text-[11px] text-gray-400">·</span>
            <span className="text-[11px] text-gray-500">멀티플 {e.multiple_used}x</span>
          </div>

          <EstimateNote listing={l} />
          <EstimateBasis listing={l} />

          <div className="mt-5 space-y-3">
            <InlineLeadForm listingId={l.id} placeName={l.studio.place_name} />
            <Link href={`/inquire?listing=${encodeURIComponent(l.id)}&kind=sell`} className="block rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-center hover:bg-amber-100 text-xs">
              <span className="font-bold text-amber-900">이거 우리 매장입니다 (원장·강사 claim)</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-6">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-emerald-900">사진·리뷰는 외부 채널에서 직접 확인</h2>
          <p className="mt-1 text-xs text-emerald-800/80">자체 사진 갤러리는 카카오 panel3 raw 추출 후 제공 예정. 지금은 외부 채널에서 직접.</p>
        </div>
        <ChannelLinks studio={s} />
        {(s.kakao_review_count ?? 0) > 0 || (s.blog_review_count ?? 0) > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-emerald-900">
            {(s.kakao_review_count ?? 0) > 0 ? <span>카카오맵 ★ {s.kakao_review_score?.toFixed(1) ?? "-"} <strong>({s.kakao_review_count?.toLocaleString()})</strong></span> : null}
            {(s.blog_review_count ?? 0) > 0 ? <span>블로그 체험단 <strong>{s.blog_review_count?.toLocaleString()}</strong>건</span> : null}
            {(s.menu_count ?? 0) > 0 ? <span>메뉴 등록 <strong>{s.menu_count}</strong>건 · {s.menu_price_min?.toLocaleString()}~{s.menu_price_max?.toLocaleString()}원</span> : null}
          </div>
        ) : null}
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">위치</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4 text-sm">
            <div className="text-xs text-gray-500">지역</div>
            <div className="mt-1 font-medium">{l.sido} {l.sigungu} {l.dong ?? ""}</div>
            <div className="mt-2 text-xs text-gray-500">좌표 {l.lat.toFixed(4)}, {l.lng.toFixed(4)}</div>
            {s.phone ? <div className="mt-2 text-xs text-gray-500">{s.phone}</div> : null}
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-sm">
            <div className="text-xs text-gray-500">등급</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{l.digital_grade}급 · {l.digital_score}/90점</div>
            <div className="mt-2 text-[11px] text-gray-500">디지털 채널·리뷰·메뉴 등록 기반</div>
          </div>
        </div>
      </section>

      {market ? (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold">{l.sigungu} 시세 비교</h2>
          <p className="mt-1 text-xs text-gray-500">동일 시군구 {market.n}개 매물 추정 분포 (p25 / p50 / p75)</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Compare label="권리금" mid={e.key_money.mid} p25={market.key_p25} p50={market.key_p50} p75={market.key_p75} fmt={fmtMan} />
            <Compare label="월매출" mid={e.monthly_revenue.mid} p25={market.rev_p25} p50={market.rev_p50} p75={market.rev_p75} fmt={fmtMan} />
            <Compare label="월수익률" mid={e.monthly_yield_pct} p25={market.yield_p25} p50={market.yield_p50} p75={market.yield_p75} fmt={(n) => `${n}%`} />
          </div>
          {l.sido && l.sigungu ? (
            <Link href={`/listings?sigungu=${encodeURIComponent(l.sigungu)}`} className="mt-3 inline-block text-xs text-emerald-700 underline">같은 지역 매물 보기 →</Link>
          ) : null}
        </section>
      ) : null}

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">인증 단계</h2>
        <p className="mt-1 text-xs text-gray-500">현재 잠재매물 단계입니다. 매장 운영자가 등록하면 진성정보가 공개됩니다.</p>
        <ol className="mt-4 space-y-2 text-sm">
          <Step done label="공개 데이터 수집 (카카오·네이버)" />
          <Step done={false} label="주인 등록 — 휴대폰·사업자번호 인증" cta="이거 우리 매장" href={`/sell/new?listing=${encodeURIComponent(l.id)}`} />
          <Step done={false} label="검증 매물 배지 — 진성정보 NDA 후 공개" />
        </ol>
      </section>

      {similar.length > 0 ? (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold">비슷한 매물</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {similar.map((x) => <ListingCard key={x.id} listing={x} />)}
          </div>
        </section>
      ) : null}

      <section className="mt-10 text-center text-xs text-gray-500">
        <p>이 매물은 카카오·네이버 공개 데이터 기반의 잠재매물입니다.</p>
        <p className="mt-1">매장 운영자이신가요? <Link href={`/listings/${l.id}/takedown`} className="underline hover:text-gray-700">이 매물 노출 거부 신청</Link> · <Link href={`/sell/new?listing=${l.id}`} className="underline hover:text-gray-700">매물 등록(주인 인증)</Link></p>
      </section>
    </div>
  );
}

function Compare({ label, mid, p25, p50, p75, fmt }: { label: string; mid: number; p25: number; p50: number; p75: number; fmt: (n: number) => string }) {
  const cmp = mid >= p75 ? "상위" : mid >= p50 ? "중상" : mid >= p25 ? "중하" : "하위";
  return (
    <div className="rounded-lg bg-gray-50 p-3 text-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 font-bold">{fmt(mid)} <span className="ml-1 text-[10px] font-medium text-gray-500">{cmp}</span></div>
      <div className="mt-2 text-[11px] text-gray-500">p25 {fmt(p25)} · p50 {fmt(p50)} · p75 {fmt(p75)}</div>
    </div>
  );
}

function Step({ done, label, cta, href }: { done: boolean; label: string; cta?: string; href?: string }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${done ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>{done ? "✓" : "○"}</span>
        <span className={done ? "text-gray-900" : "text-gray-600"}>{label}</span>
      </div>
      {cta && href ? <Link href={href} className="rounded-md bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-200">{cta} →</Link> : null}
    </li>
  );
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const l = getListing(id);
  if (!l) return { title: "매물을 찾을 수 없습니다" };
  return {
    title: `${l.studio.place_name} · ${l.sigungu ?? ""} · 잠재매물 (권리금 ${fmtMan(l.estimate.key_money.mid)} 추정)`,
    description: `잠재매물 — ${[l.sigungu, l.dong].filter(Boolean).join(" · ")}. 추정 권리금 ${fmtMan(l.estimate.key_money.mid)}, 월수익률 ${l.estimate.monthly_yield_pct}%.`,
    robots: { index: true, follow: true },
  };
}
