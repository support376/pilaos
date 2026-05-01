import Link from "next/link";
import { notFound } from "next/navigation";
import { summary, listingsBySigungu, sigunguDistribution, nationalDistribution } from "@/lib/listings";
import { fmtMan } from "@/lib/estimate";
import type { Histogram } from "@/lib/listings";

type Params = { params: Promise<{ slug: string }> };

function Histogram({ data, fmt, color = "#f59e0b" }: { data: Histogram; fmt: (n: number) => string; color?: string }) {
  if (!data.bins.length) return <p className="text-xs text-gray-400">데이터 없음</p>;
  const maxCount = Math.max(...data.bins.map((b) => b.count));
  return (
    <div>
      <div className="flex items-end gap-0.5 h-32">
        {data.bins.map((b, i) => {
          const h = maxCount ? Math.round((b.count / maxCount) * 100) : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end" title={`${fmt(b.from)} ~ ${fmt(b.to)} : ${b.count}건`}>
              <div className="w-full rounded-t" style={{ height: `${h}%`, backgroundColor: color, opacity: 0.85 }} />
              <span className="mt-1 text-[9px] text-gray-500 rotate-45 origin-top-left">{fmt(b.from)}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-7 flex justify-between text-[10px] text-gray-500">
        <span>최소 {fmt(data.min)}</span>
        <span>중앙 {fmt(data.median)}</span>
        <span>평균 {fmt(Math.round(data.mean))}</span>
        <span>최대 {fmt(data.max)}</span>
      </div>
    </div>
  );
}

export default async function MarketPage({ params }: Params) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const s = summary();
  const m = s.by_sigungu.find((x) => x.sigungu === decoded);
  if (!m) return notFound();

  const dist = sigunguDistribution(m.sido, m.sigungu);
  const nat = nationalDistribution();
  const rows = listingsBySigungu(m.sido, m.sigungu, 1000);

  // 가성비 매물: 수익률 상위 5
  const valuePicks = [...rows].sort((a, b) => b.estimate.monthly_yield_pct - a.estimate.monthly_yield_pct).slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/listings" className="hover:text-gray-900">매물</Link>
        <span>/</span>
        <Link href={`/area/${encodeURIComponent(m.sigungu)}`} className="hover:text-gray-900">{m.sigungu}</Link>
        <span>/</span>
        <span className="text-gray-700">시세</span>
      </div>

      <header>
        <h1 className="text-2xl font-bold">{m.sido} {m.sigungu} 시세 분포</h1>
        <p className="mt-1 text-sm text-gray-600">잠재매물 {dist.n}건의 추정값 분포 — 권리금·월매출·월수익률.</p>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="권리금 중앙값" v={fmtMan(dist.keyMoney.median)} sub={`전국 ${fmtMan(nat.keyMoney.median)} 대비 ${dist.keyMoney.median > nat.keyMoney.median ? "+" : ""}${Math.round((dist.keyMoney.median - nat.keyMoney.median) / nat.keyMoney.median * 100)}%`} />
        <Stat label="월매출 중앙값" v={fmtMan(dist.revenue.median)} sub={`전국 ${fmtMan(nat.revenue.median)} 대비 ${dist.revenue.median > nat.revenue.median ? "+" : ""}${Math.round((dist.revenue.median - nat.revenue.median) / nat.revenue.median * 100)}%`} />
        <Stat label="월수익률 중앙값" v={`${dist.yield_pct.median}%`} sub={`전국 ${nat.yield_pct.median}% 대비 ${dist.yield_pct.median > nat.yield_pct.median ? "+" : ""}${(dist.yield_pct.median - nat.yield_pct.median).toFixed(1)}%p`} />
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">권리금 분포</h2>
        <p className="mt-1 text-xs text-gray-500">{dist.n}개 매물의 권리금 추정 히스토그램. 높이 = 매물 수.</p>
        <div className="mt-4">
          <Histogram data={dist.keyMoney} fmt={fmtMan} color="#f59e0b" />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">월매출 분포</h2>
        <div className="mt-4">
          <Histogram data={dist.revenue} fmt={fmtMan} color="#10b981" />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">월수익률 분포</h2>
        <div className="mt-4">
          <Histogram data={dist.yield_pct} fmt={(n) => `${Math.round(n)}%`} color="#0ea5e9" />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">가성비 매물 TOP 5 — 수익률 높은순</h2>
        <p className="mt-1 text-xs text-gray-500">{m.sigungu}에서 추정 수익률이 가장 높은 5개 매물.</p>
        <div className="mt-4 space-y-2">
          {valuePicks.map((l, i) => (
            <Link key={l.id} href={`/listings/${l.id}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 transition hover:border-amber-400">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">{i + 1}</span>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 truncate">{l.studio.place_name}</div>
                  <div className="text-xs text-gray-500">권리금 {fmtMan(l.estimate.key_money.mid)} · 디지털 {l.digital_grade}급</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-emerald-700">{l.estimate.monthly_yield_pct}%</div>
                <div className="text-[10px] text-gray-500">회수 {l.estimate.payback_months_keyMoney}개월</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
        <strong>주의.</strong> 모든 분포는 잠재매물의 추정값 기반입니다. 실거래 데이터 누적 시 v3.0 calibration으로 정확도 개선 예정.
      </div>
    </div>
  );
}

function Stat({ label, v, sub }: { label: string; v: string; sub: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{v}</div>
      <div className="mt-1 text-[11px] text-gray-500">{sub}</div>
    </div>
  );
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  return { title: `${decodeURIComponent(slug)} 필라테스 시세 분포` };
}
