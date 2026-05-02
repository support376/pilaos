import Link from "next/link";
import { redirect } from "next/navigation";
import { searchListings, summary, regionTree, topRegions, isMetroSido } from "@/lib/listings";
import { ListingCard } from "@/components/listing/ListingCard";
import { RegionSelect } from "@/components/listing/RegionSelect";

async function go(formData: FormData) {
  "use server";
  const q = String(formData.get("q") || "").trim();
  const sido = String(formData.get("sido") || "").trim();
  const sigungu = String(formData.get("sigungu") || "").trim();

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (sido) params.set("sido", sido);
  if (sigungu) params.set("sigungu", sigungu);
  redirect(params.toString() ? `/listings?${params.toString()}` : "/listings");
}

export default function Home() {
  const s = summary();
  const tree = regionTree();
  const popular = topRegions(8); // 모바일 8개로 축소
  const featured = searchListings({}, "yield_desc", 4).rows;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      {/* HERO */}
      <section>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
          필라테스·요가 매물<br className="sm:hidden" />
          <span className="text-amber-500"> 한 곳에</span>
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          전국 1만 매장 · 권리금 추정 · 매수/매도 신청
        </p>

        {/* 검색 + 지역 */}
        <form action={go} className="mt-5 space-y-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <input
            name="q"
            type="text"
            placeholder="상호 · 동 · 주소"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base focus:bg-white focus:border-gray-900 focus:outline-none"
          />
          <RegionSelect metros={tree.metros} dos={tree.dos} />
          <button className="w-full rounded-lg bg-gray-900 px-4 py-3 text-base font-bold text-white hover:bg-gray-700">
            매물 검색
          </button>
        </form>
      </section>

      {/* 시도로 찾기 — 모바일 핵심 진입 */}
      <section className="mt-8">
        <h2 className="mb-3 text-base font-bold text-gray-900">📍 지역으로 찾기</h2>

        <div>
          <p className="mb-1.5 text-[11px] font-semibold text-gray-500">광역시·특별시</p>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
            {tree.metros.map((g) => (
              <Link
                key={g.sido}
                href={`/listings?sido=${encodeURIComponent(g.sido)}`}
                className="rounded-lg border border-gray-200 bg-white px-2 py-3 text-center hover:bg-gray-50"
              >
                <div className="text-sm font-bold">{g.sido}</div>
                <div className="text-[10px] text-gray-500">{g.total.toLocaleString()}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-semibold text-gray-500">도</p>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-9">
            {tree.dos.map((g) => (
              <Link
                key={g.sido}
                href={`/listings?sido=${encodeURIComponent(g.sido)}`}
                className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-3 text-center hover:bg-white"
              >
                <div className="text-sm font-bold">{g.sido}</div>
                <div className="text-[10px] text-gray-500">{g.total.toLocaleString()}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 인기 시군구 칩 (8개) */}
      <section className="mt-8">
        <h2 className="mb-2 text-sm font-bold text-gray-700">인기 시군구 <span className="text-[11px] font-normal text-gray-400">(매물 수 상위 8)</span></h2>
        <div className="flex flex-wrap gap-1.5">
          {popular.map((r) => (
            <Link
              key={`${r.sido}-${r.sigungu}`}
              href={`/listings?sido=${encodeURIComponent(r.sido)}&sigungu=${encodeURIComponent(r.sigungu)}`}
              className={`rounded-full border px-3 py-1 text-xs hover:bg-gray-50 ${isMetroSido(r.sido) ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"}`}
            >
              <span className="text-gray-500">{r.sido}</span>
              <span className="ml-1 font-medium">{r.sigungu}</span>
              <span className="ml-1 text-gray-400">{r.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 추천 매물 */}
      <section className="mt-8">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-base font-bold">추천 매물</h2>
          <Link href="/listings?sort=score" className="text-xs text-gray-500 hover:text-gray-900">전체 →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      {/* 신청 — 큰 CTA */}
      <section className="mt-8 grid gap-2 sm:grid-cols-3">
        <Link href="/inquire?kind=acquire" className="rounded-xl bg-gray-900 px-4 py-4 text-center text-sm font-bold text-white hover:bg-gray-700">
          매수 신청
        </Link>
        <Link href="/inquire?kind=sell" className="rounded-xl border-2 border-gray-900 bg-white px-4 py-4 text-center text-sm font-bold text-gray-900 hover:bg-gray-100">
          매도·매물 등록
        </Link>
        <Link href="/inquire?kind=start" className="rounded-xl border border-gray-300 bg-white px-4 py-4 text-center text-sm font-bold text-gray-700 hover:bg-gray-50">
          창업·기타 문의
        </Link>
      </section>

      <p className="mt-6 text-center text-[11px] text-gray-400">
        총 {s.total.toLocaleString()}개 잠재매물 · 카카오 공개 데이터 기반 · 추정치
      </p>
    </div>
  );
}
