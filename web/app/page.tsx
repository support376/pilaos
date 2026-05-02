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
          <span className="text-gray-300">·</span>
          <Link href="/start/intent" className="hover:text-gray-900">창업 검토</Link>
          <span className="text-gray-300">·</span>
          <Link href="/close/intent" className="hover:text-gray-900">폐업 패키지</Link>
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

      {/* 호호요가 차별화 카피 (PIL-32-10) */}
      <section className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">왜 pilaos인가</p>
        <h2 className="mt-2 text-xl font-bold text-emerald-900">기존 인수 매물은 호호요가 등에서 매도자가 직접 등록한 것뿐</h2>
        <p className="mt-2 text-sm text-emerald-900/85 leading-relaxed">
          pilaos는 전국 1만 매장을 자동 수집한 <strong>잠재매물 풀</strong>을 운영하며, 변호사 동반 실사로 분쟁을 사전 예방합니다. 호호요가·점포라인이 다루지 않는 매물도 발굴합니다.
        </p>
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

      {/* 분쟁 박스 */}
      <section className="mt-12 rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-rose-700">왜 실사가 필요한가</p>
        <h2 className="mt-2 text-xl font-bold">영업양수도 100건 中 30~40건은 분쟁</h2>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          매출 부풀리기·임대 갱신 거부·회원 환급·강사 단체 이탈·시설 하자·양도세 누락. 변호사 동반 실사로 사전 예방하세요.
        </p>
        <Link href="/why" className="mt-4 inline-block rounded-md bg-rose-700 px-4 py-2 text-sm font-bold text-white hover:bg-rose-800">분쟁 11대 유형 + 실사 자세히 →</Link>
      </section>

      {/* 시도 분포 (페이지 하단) */}
      <section className="mt-12">
        <h2 className="mb-3 text-sm font-bold text-gray-700">시도별 매물 분포</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {s.by_sido.map((r) => (
            <Link key={r.sido} href={`/listings?sido=${encodeURIComponent(r.sido)}`} className="flex justify-between rounded-md bg-white px-3 py-2 text-xs hover:bg-gray-50">
              <span className="font-medium">{r.sido}</span>
              <span className="text-gray-500">{r.n.toLocaleString()}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
