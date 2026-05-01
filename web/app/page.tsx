import Link from "next/link";
import { redirect } from "next/navigation";
import { searchListings, summary } from "@/lib/listings";
import { fmtMan } from "@/lib/estimate";
import { ListingCard } from "@/components/listing/ListingCard";

async function go(formData: FormData) {
  "use server";
  const q = String(formData.get("q") || "").trim();
  redirect(q ? `/listings?q=${encodeURIComponent(q)}` : "/listings");
}

export default function Home() {
  const s = summary();
  const featured = searchListings({}, "yield_desc", 6).rows;
  const buyerHot = searchListings({}, "fav", 4).rows;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* HERO */}
      <section className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-600">전국 1만개 필라테스 매물</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          필라테스 사고팔고 <span className="text-amber-500">닫는</span> 곳
        </h1>
        <p className="mt-3 text-sm text-gray-600">권리금·수익률·매수자 대기까지 30초면 다 보이는 매물 마켓플레이스</p>
        <form action={go} className="mt-6 flex justify-center">
          <div className="flex w-full max-w-xl">
            <input name="q" type="text" placeholder="상호·동·주소" className="flex-1 rounded-l-xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            <button className="rounded-r-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-gray-700">매물 찾기</button>
          </div>
        </form>
        <div className="mt-4 flex justify-center gap-3 text-[11px] text-gray-500">
          <span>매물 <strong className="text-gray-900">{s.total.toLocaleString()}</strong></span>
          <span>· 매수자 <strong className="text-gray-900">{s.buyer_pool}</strong>명 대기</span>
          <span>· 매도 의향 <strong className="text-gray-900">{s.intent_sell_count}</strong></span>
        </div>
      </section>

      {/* 4 INTENTS */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold">어떻게 오셨나요?</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Link href="/start/intent" className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-sky-400 hover:shadow-sm">
            <span className="inline-block rounded-md bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-800">CREATE</span>
            <h3 className="mt-2 text-base font-bold">창업하고 싶다</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">아직 매장 없음. 어디서 얼마짜리로 시작할지.</p>
          </Link>
          <Link href="/buy/intent" className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm">
            <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">ACQUIRE</span>
            <h3 className="mt-2 text-base font-bold">인수하고 싶다</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">2호점·확장. 워치리스트 + 매칭 알림.</p>
          </Link>
          <Link href="/sell/new" className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-sm">
            <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">SELL</span>
            <h3 className="mt-2 text-base font-bold">팔고 싶다</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">권리금 회수·이전. 익명 매물·검증.</p>
          </Link>
          <Link href="/close/intent" className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-rose-400 hover:shadow-sm">
            <span className="inline-block rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800">CLOSE</span>
            <h3 className="mt-2 text-base font-bold">폐업하고 싶다</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">임대·회원·비품·세무 한 번에 마무리.</p>
          </Link>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="mt-12">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">🔥 수익률 높은 매물</h2>
          <Link href="/listings?sort=yield_desc" className="text-xs text-gray-500 hover:text-gray-900">전체 보기 →</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      {/* SIGUNGU */}
      <section className="mt-12">
        <h2 className="mb-3 text-lg font-bold">📍 지역별 매물</h2>
        <div className="flex flex-wrap gap-2">
          {s.by_sigungu.slice(0, 16).map((r) => (
            <Link key={`${r.sido}-${r.sigungu}`} href={`/listings?sigungu=${encodeURIComponent(r.sigungu)}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm hover:bg-gray-50">
              {r.sigungu} <span className="text-gray-400">({r.count})</span>
            </Link>
          ))}
        </div>
      </section>

      {/* BUYER POOL */}
      <section className="mt-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">잠재 매수자가 먼저 와있습니다</p>
        <h2 className="mt-2 text-2xl font-bold">전국 <span className="text-amber-400">{s.buyer_pool}명</span>의 매수자가 매물을 기다리는 중</h2>
        <p className="mt-2 text-sm text-gray-300">매도 의향만 등록해주시면, 조건 맞는 매수자에게 NDA 후 매칭됩니다.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/sell/new" className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-gray-900 hover:bg-amber-400">매물 등록 (2분)</Link>
          <Link href="/listings" className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-700">매물 둘러보기</Link>
        </div>
      </section>

      {/* SIDO */}
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
