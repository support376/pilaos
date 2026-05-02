import { Suspense } from "react";
import Link from "next/link";
import { ListingCard } from "@/components/listing/ListingCard";
import { FilterSidebar } from "@/components/listing/FilterSidebar";
import { SortBar } from "@/components/listing/SortBar";
import { searchListings, summary, regionTree, type ListingFilters, type ListingSort } from "@/lib/listings";

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
    noKeyMoney: asStr(sp.no_key) === "1",
  };
  const sort = (asStr(sp.sort) as ListingSort) ?? "ad";
  const page = Math.max(1, asNum(sp.page) ?? 1);
  const perOptions = [20, 30, 40, 50];
  const perRaw = asNum(sp.per);
  const perPage = perOptions.includes(perRaw ?? 0) ? (perRaw as number) : 30;
  const offset = (page - 1) * perPage;

  const { rows, total } = searchListings(filters, sort, perPage, offset);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const s = summary();
  const tree = regionTree();

  // sort link 보존용 search dict (string keys)
  const searchDict: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    const sv = asStr(v);
    if (typeof sv === "string" && sv.length) searchDict[k] = sv;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 sm:mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">매물 검색</div>
        <h1 className="mt-2 text-[26px] sm:text-[32px] font-extrabold tracking-tight">
          전국 <span className="text-blue-600">{total.toLocaleString()}곳</span>
        </h1>
        <p className="mt-2 text-[13px] sm:text-sm text-black/60 leading-relaxed">
          카카오·네이버 공개 데이터 기반의 잠재매물입니다. 권리금·매출은 모두 추정값.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <details className="md:hidden rounded-lg border border-black/10 bg-white">
          <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-black/85">
            🔍 필터 ({total.toLocaleString()}건)
          </summary>
          <div className="border-t border-black/5 p-3">
            <FilterSidebar total={s.total} filtered={total} current={searchDict} metros={tree.metros} dos={tree.dos} />
          </div>
        </details>
        <div className="hidden md:block">
          <FilterSidebar total={s.total} filtered={total} current={searchDict} metros={tree.metros} dos={tree.dos} />
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Suspense>
                <SortBar current={sort} search={searchDict} />
              </Suspense>
            </div>
            <PerPageSelect current={perPage} options={perOptions} search={searchDict} />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {rows.length === 0 ? (
              <div className="md:col-span-2 rounded-xl border border-dashed border-black/15 bg-white p-10 text-center">
                <div className="text-sm font-bold text-black">조건에 맞는 매물이 없습니다.</div>
                <p className="mt-1 text-xs text-black/55">필터를 완화하시거나, <a href="/inquire?kind=acquire" className="text-blue-600 underline">조건만 등록</a>하시면 매칭해드립니다.</p>
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
      {current > 1 ? <Link href={linkFor(current - 1)} className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5">←</Link> : null}
      {items.map((p) => (
        <Link key={p} href={linkFor(p)} className={`min-w-[36px] text-center rounded-md px-2.5 py-1.5 text-sm font-medium ${p === current ? "bg-black text-white" : "border border-black/15 hover:bg-black/5"}`}>{p}</Link>
      ))}
      {current < totalPages ? <Link href={linkFor(current + 1)} className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5">→</Link> : null}
    </nav>
  );
}

function PerPageSelect({ current, options, search }: { current: number; options: number[]; search: Record<string, string> }) {
  const linkFor = (n: number) => {
    const sp = new URLSearchParams(search);
    sp.set("per", String(n));
    sp.delete("page");
    return `/listings?${sp.toString()}`;
  };
  return (
    <div className="flex shrink-0 items-center gap-1 text-xs text-black/55">
      <span>페이지당</span>
      {options.map((n) => (
        <Link
          key={n}
          href={linkFor(n)}
          className={`rounded px-2 py-1 ${n === current ? "bg-black text-white" : "border border-black/15 hover:bg-black/[.03]"}`}
        >
          {n}
        </Link>
      ))}
    </div>
  );
}
