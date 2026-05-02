import Link from "next/link";
import { redirect } from "next/navigation";
import { searchListings, summary } from "@/lib/listings";
import { ListingCard } from "@/components/listing/ListingCard";

async function go(formData: FormData) {
  "use server";
  const q = String(formData.get("q") || "").trim();
  const sigungu = String(formData.get("sigungu") || "").trim();
  const key_max = String(formData.get("key_max") || "").trim();

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (sigungu) params.set("sigungu", sigungu);
  if (key_max) params.set("key_max", key_max);
  redirect(params.toString() ? `/listings?${params.toString()}` : "/listings");
}

export default function Home() {
  const s = summary();
  const featured = searchListings({}, "yield_desc", 6).rows;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* HERO — 검색 중심 (엔카식) */}
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
          전국 필라테스 매장 <span className="text-amber-500">한 곳에</span>
        </h1>
        <p className="mt-4 text-sm text-gray-600 max-w-2xl mx-auto">
          모든 지점 정보 · SNS 운영현황 · 추정매출 · 가치 측정 · 매수 의향 등록까지
        </p>

        {/* 큰 검색 폼 */}
        <form action={go} className="mt-8 mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="grid gap-2 sm:grid-cols-[1fr_180px_180px_auto]">
            <input
              name="q"
              type="text"
              placeholder="상호 · 동 · 주소"
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:bg-white focus:border-gray-900 focus:outline-none"
            />
            <select name="sigungu" defaultValue="" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm focus:bg-white focus:border-gray-900">
              <option value="">전체 지역</option>
              {s.by_sigungu.slice(0, 30).map((x) => (
                <option key={x.sigungu} value={x.sigungu}>{x.sigungu}</option>
              ))}
            </select>
            <select name="key_max" defaultValue="" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm focus:bg-white focus:border-gray-900">
              <option value="">권리금 무관</option>
              <option value="0">무권리만</option>
              <option value="3000">3천만 이하</option>
              <option value="5000">5천만 이하</option>
              <option value="10000">1억 이하</option>
              <option value="30000">3억 이하</option>
            </select>
            <button className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-gray-700">검색</button>
          </div>
        </form>

        {/* 작은 보조 링크 */}
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-gray-600">
          <Link href="/buy/intent" className="hover:text-gray-900">매수 의향 등록</Link>
          <span className="text-gray-300">·</span>
          <Link href="/sell/new" className="hover:text-gray-900">매물 등록 (매도)</Link>
        </div>
      </section>

      {/* 인기 지역 칩 */}
      <section className="mt-12">
        <h2 className="mb-3 text-sm font-bold text-gray-700">📍 인기 지역</h2>
        <div className="flex flex-wrap gap-2">
          {s.by_sigungu.slice(0, 18).map((r) => (
            <Link key={`${r.sido}-${r.sigungu}`} href={`/listings?sigungu=${encodeURIComponent(r.sigungu)}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm hover:bg-gray-50">
              {r.sigungu} <span className="text-gray-400">({r.count})</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 추천 매물 */}
      <section className="mt-12">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">디지털 운영도 우수 매물</h2>
          <Link href="/listings?sort=score" className="text-xs text-gray-500 hover:text-gray-900">전체 보기 →</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>
    </div>
  );
}
