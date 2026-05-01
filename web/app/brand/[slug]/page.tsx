import { notFound } from "next/navigation";
import Link from "next/link";
import { brandBySlug, BRANDS } from "@/lib/brands";
import { listingsByBrand } from "@/lib/listings";
import { ListingCard } from "@/components/listing/ListingCard";
import { fmtMan } from "@/lib/estimate";

type Params = { params: Promise<{ slug: string }> };

export default async function BrandPage({ params }: Params) {
  const { slug } = await params;
  const b = brandBySlug(slug);
  if (!b) return notFound();
  const rows = listingsByBrand(slug, 60);
  const total = rows.length;
  const avgKey = total ? Math.round(rows.reduce((a, l) => a + l.estimate.key_money.mid, 0) / total) : 0;
  const avgYield = total ? Math.round(rows.reduce((a, l) => a + l.estimate.monthly_yield_pct, 0) / total * 10) / 10 : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/listings" className="text-xs text-gray-500 hover:text-gray-900">← 매물 전체</Link>

      <header className="mt-3">
        <h1 className="text-2xl font-bold">{b.name} 매물 · {total}건</h1>
        <p className="mt-1 text-sm text-gray-600">평균 권리금 {fmtMan(avgKey)} · 평균 월수익률 {avgYield}%</p>
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        {BRANDS.map((x) => (
          <Link key={x.slug} href={`/brand/${x.slug}`}
            className={`rounded-full border px-3 py-1.5 text-xs ${x.slug === slug ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white hover:bg-gray-50"}`}>
            {x.name}
          </Link>
        ))}
      </div>

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        {rows.length === 0 ? (
          <div className="md:col-span-2 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
            이 브랜드 매물이 아직 등록되지 않았습니다.
          </div>
        ) : rows.map((l) => <ListingCard key={l.id} listing={l} />)}
      </section>
    </div>
  );
}
