import { Suspense } from "react";
import Link from "next/link";
import { ListingCard } from "@/components/listing/ListingCard";
import { FilterSidebar } from "@/components/listing/FilterSidebar";
import { SortBar } from "@/components/listing/SortBar";
import { searchListings, summary, type ListingFilters, type ListingSort } from "@/lib/listings";

export const metadata = {
  title: "매물 전체 — 필라테스 양수도",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function asStr(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}
function asNum(v: string | string[] | undefined): number | undefined {
  const s = asStr(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export default async function ListingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filters: ListingFilters = {
    q: asStr(sp.q),
    sigungu: asStr(sp.sigungu),
    sido: asStr(sp.sido),
    brand: asStr(sp.brand),
    keyMoneyMin: asNum(sp.key_min),
    keyMoneyMax: asNum(sp.key_max),
    totalAcqMax: asNum(sp.total_max),
    yieldMin: asNum(sp.yield_min),
    paybackMax: asNum(sp.payback_max),
    hasNaver: asStr(sp.has_naver) === "1",
    hasKakaoChannel: asStr(sp.has_kchan) === "1",
    hasInstagram: asStr(sp.has_insta) === "1",
    hasBlog: asStr(sp.has_blog) === "1",
    hasHomepage: asStr(sp.has_hp) === "1",
    hasReviews: asStr(sp.has_rev) === "1",
  };
  const sort = (asStr(sp.sort) as ListingSort) ?? "ad";
  const page = Math.max(1, asNum(sp.page) ?? 1);
  const perPage = 24;
  const offset = (page - 1) * perPage;

  const { rows, total } = searchListings(filters, sort, perPage, offset);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const s = summary();
  const topSigungu = s.by_sigungu.slice(0, 30).map((x) => ({ sigungu: x.sigungu, count: x.count }));

  // sort link 보존용 search dict (string keys)
  const searchDict: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    const sv = asStr(v);
    if (typeof sv === "string" && sv.length) searchDict[k] = sv;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-baseline justify-between">
        <div><h1 className="text-2xl font-bold">잠재매물 전체 <span className="text-sm font-normal text-gray-500">({total.toLocaleString()}건)</span></h1><p className="mt-1 text-xs text-gray-500">전국 운영 중인 필라테스를 카카오·네이버 공개 데이터 기반으로 정리. 권리금·매출은 추정치.</p></div>
        <Link href="/listings" className="text-xs text-gray-500 hover:text-gray-900">전체 매물</Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <FilterSidebar total={s.total} filtered={total} current={searchDict} topSigungu={topSigungu} />

        <div>
          <Suspense>
            <SortBar current={sort} search={searchDict} />
          </Suspense>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {rows.length === 0 ? (
              <div className="md:col-span-2 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
                조건에 맞는 매물이 없습니다. 필터를 완화해보세요.
              </div>
            ) : (
              rows.map((l) => <ListingCard key={l.id} listing={l} />)
            )}
          </div>

          {totalPages > 1 ? (
            <Pagination current={page} totalPages={totalPages} search={searchDict} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Pagination({ current, totalPages, search }: { current: number; totalPages: number; search: Record<string, string> }) {
  const linkFor = (p: number) => {
    const sp = new URLSearchParams(search);
    sp.set("page", String(p));
    return `/listings?${sp.toString()}`;
  };
  const items: number[] = [];
  const start = Math.max(1, current - 3);
  const end = Math.min(totalPages, current + 3);
  for (let i = start; i <= end; i++) items.push(i);
  return (
    <nav className="mt-6 flex items-center justify-center gap-1 text-sm">
      {current > 1 ? <Link href={linkFor(current - 1)} className="rounded border px-3 py-1.5 hover:bg-gray-50">←</Link> : null}
      {items.map((p) => (
        <Link key={p} href={linkFor(p)} className={`rounded px-3 py-1.5 ${p === current ? "bg-gray-900 text-white" : "border hover:bg-gray-50"}`}>{p}</Link>
      ))}
      {current < totalPages ? <Link href={linkFor(current + 1)} className="rounded border px-3 py-1.5 hover:bg-gray-50">→</Link> : null}
    </nav>
  );
}
