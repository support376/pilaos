import Link from "next/link";
import { notFound } from "next/navigation";
import { listingsBySigungu, sigunguMarketStats, summary } from "@/lib/listings";
import { ListingCard } from "@/components/listing/ListingCard";
import { fmtMan } from "@/lib/estimate";

type Params = { params: Promise<{ slug: string }> };

export default async function AreaPage({ params }: Params) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const s = summary();
  const m = s.by_sigungu.find((x) => x.sigungu === decoded);
  if (!m) return notFound();
  const rows = listingsBySigungu(m.sido, m.sigungu, 60);
  const stats = sigunguMarketStats(m.sido, m.sigungu);
  const buyerCount = rows.reduce((a, l) => a + l.buyer_intent_count, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/listings" className="text-xs text-gray-500 hover:text-gray-900">← 매물 전체</Link>

      <header className="mt-3">
        <h1 className="text-2xl font-bold">{m.sido} {m.sigungu} 매물 · {rows.length}건</h1>
        <p className="mt-1 text-sm text-gray-600">매수자 <strong>{buyerCount}명</strong> 대기 · <Link href={`/listings?sigungu=${encodeURIComponent(m.sigungu)}`} className="underline">전체 필터로 보기</Link></p>
      </header>

      {stats ? (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold">{m.sigungu} 시세</h2>
          <p className="mt-1 text-xs text-gray-500">{stats.n}개 매물 분포</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="권리금 중앙값" v={fmtMan(stats.key_p50)} sub={`${fmtMan(stats.key_p25)}~${fmtMan(stats.key_p75)}`} />
            <Stat label="월매출 중앙값" v={fmtMan(stats.rev_p50)} sub={`${fmtMan(stats.rev_p25)}~${fmtMan(stats.rev_p75)}`} />
            <Stat label="월수익률 중앙값" v={`${stats.yield_p50}%`} sub={`${stats.yield_p25}%~${stats.yield_p75}%`} />
          </div>
        </section>
      ) : null}

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        {rows.map((l) => <ListingCard key={l.id} listing={l} />)}
      </section>
    </div>
  );
}

function Stat({ label, v, sub }: { label: string; v: string; sub: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-bold">{v}</div>
      <div className="text-[11px] text-gray-400">{sub}</div>
    </div>
  );
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  return { title: `${decodeURIComponent(slug)} 필라테스 매물 · 시세` };
}
