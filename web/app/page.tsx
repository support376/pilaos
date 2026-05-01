import Link from "next/link";
import { redirect } from "next/navigation";
import { searchListings, summary } from "@/lib/listings";
import { ListingCard } from "@/components/listing/ListingCard";

async function go(formData: FormData) {
  "use server";
  const q = String(formData.get("q") || "").trim();
  redirect(q ? `/listings?q=${encodeURIComponent(q)}` : "/listings");
}

export default function Home() {
  const s = summary();
  const featured = searchListings({}, "yield_desc", 6).rows;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-600">전국 잠재매물 1만개</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          필라테스 매장 사고팔고 <span className="text-amber-500">닫는</span> 곳
        </h1>
        <p className="mt-3 text-sm text-gray-600">전국 모든 운영 중인 필라테스를 잠재매물로 정리. 사고 싶으면 ♥, 팔고 싶으면 등록.</p>
        <form action={go} className="mt-6 flex justify-center">
          <div className="flex w-full max-w-xl">
            <input name="q" type="text" placeholder="상호 · 동 · 주소" className="flex-1 rounded-l-xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            <button className="rounded-r-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-gray-700">매물 찾기</button>
          </div>
        </form>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-[11px] text-gray-500">
          <span>잠재매물 <strong className="text-gray-900">{s.total.toLocaleString()}</strong></span>
          <span aria-hidden>·</span>
          <span>주인 등록 <strong className="text-gray-900">{s.claimed_count}</strong></span>
          <span aria-hidden>·</span>
          <span>매수 의향 <strong className="text-gray-900">{s.buyer_pool}</strong></span>
        </div>
      </section>

      {/* MVP 안내 */}
      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-base font-bold text-amber-900">지금 베타 단계 (MVP)</h2>
        <ol className="mt-3 space-y-1.5 text-sm text-amber-900/85 list-decimal pl-5">
          <li>모든 매물이 카카오·네이버 공개 데이터 기반의 <strong>잠재매물</strong>입니다. 권리금·매출은 추정치.</li>
          <li>매수자는 ♥로 관심 매물 등록 + 매수 의향 제출. 우리가 매도 측에 의향 확인 컨택을 진행합니다.</li>
          <li>매도자는 "이거 우리 매장입니다" 클릭으로 등록. 본인확인 후 정보 수정 + 매수자와 매칭.</li>
          <li>실사·계약·회원 승계 등 우리가 도와드릴 업무는 매칭 성사 후 안내드립니다.</li>
        </ol>
      </section>

      {/* 4 인텐트 */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold">어떻게 오셨나요?</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Link href="/buy/intent" className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm">
            <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">BUY</span>
            <h3 className="mt-2 text-base font-bold">사고 싶다 / 인수</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">관심 매물 ♥ + 매수 의향 등록. 우리가 매도 측 컨택 대행.</p>
          </Link>
          <Link href="/sell/new" className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-sm">
            <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">SELL</span>
            <h3 className="mt-2 text-base font-bold">팔고 싶다 / 매도</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">우리 매장 등록 + 권리금 회수. 익명 노출 가능.</p>
          </Link>
          <Link href="/start/intent" className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-sky-400 hover:shadow-sm">
            <span className="inline-block rounded-md bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-800">CREATE</span>
            <h3 className="mt-2 text-base font-bold">창업하고 싶다</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">매장 없음. 시세 리포트 + 매물 알림.</p>
          </Link>
          <Link href="/close/intent" className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-rose-400 hover:shadow-sm">
            <span className="inline-block rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800">CLOSE</span>
            <h3 className="mt-2 text-base font-bold">폐업하고 싶다</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">임대·회원·비품·세무 한 번에.</p>
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">디지털 운영도 우수 매물</h2>
          <Link href="/listings?sort=score" className="text-xs text-gray-500 hover:text-gray-900">전체 보기 →</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-3 text-lg font-bold">📍 지역별 매물</h2>
        <div className="flex flex-wrap gap-2">
          {s.by_sigungu.slice(0, 18).map((r) => (
            <Link key={`${r.sido}-${r.sigungu}`} href={`/listings?sigungu=${encodeURIComponent(r.sigungu)}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm hover:bg-gray-50">
              {r.sigungu} <span className="text-gray-400">({r.count})</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">매수자가 ♥ 표시한 매물</p>
        <h2 className="mt-2 text-2xl font-bold">관심 매물에 매수 의향이 모이면<br/>운영팀이 매도 측에 직접 컨택합니다</h2>
        <p className="mt-2 text-sm text-gray-300">매도 의사 없던 매장도 "잠재 매수자가 N명 대기 중"이라는 메시지에 의향을 밝히는 경우가 많습니다.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/listings" className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-gray-900 hover:bg-amber-400">매물 둘러보기</Link>
          <Link href="/me/watchlist" className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-700">내 관심 매물</Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-3 text-lg font-bold">시도별 매물 분포</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {s.by_sido.map((r) => (
            <div key={r.sido} className="flex justify-between rounded-md bg-white px-3 py-2 text-xs">
              <span className="font-medium">{r.sido}</span>
              <span className="text-gray-500">{r.n.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
