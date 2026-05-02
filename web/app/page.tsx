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
        <p className="text-xs font-bold uppercase tracking-widest text-amber-600">전국 필라테스 매장 한 곳에</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          모든 지점 · SNS 운영현황 · <span className="text-amber-500">추정매출</span>까지
        </h1>
        <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
          전국 필라테스 매장 정보를 한 화면에 모았습니다. 가치를 측정해보고, 살까 말까 비교하고, 관심 매물로 두고 활동을 지켜보다, 매수 의향이 생기면 우리에게 의뢰하세요.
        </p>
        <form action={go} className="mt-7 flex justify-center">
          <div className="flex w-full max-w-xl">
            <input name="q" type="text" placeholder="상호 · 동 · 주소" className="flex-1 rounded-l-xl border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            <button className="rounded-r-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-gray-700">매물 찾기</button>
          </div>
        </form>
      </section>

      {/* 빠른 진입 — 4 인텐트 */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold">어떻게 오셨나요?</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Link href="/buy/intent" className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm">
            <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">BUY</span>
            <h3 className="mt-2 text-base font-bold">사고 싶다 / 인수</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">관심 매물 ♥ + 매수 의향 등록. 운영팀이 매도 측 컨택 대행.</p>
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

      {/* 왜 pilaos인가 — 분쟁/실사 박스 */}
      <section className="mt-12 rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-rose-700">왜 pilaos가 필요한가</p>
        <h2 className="mt-2 text-2xl font-bold">실사 없이 거래하면 — 영업양수도 100건 中 30~40건은 분쟁</h2>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed max-w-3xl">
          매출 부풀리기·임대차 갱신 거부·회원 환급 분쟁·강사 단체 이탈·시설 하자·양도소득세 누락. 매도자도 매수자도 놓치기 쉬운 6대 분쟁 유형의 실사로 사전 예방하세요.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3 text-sm">
          <Stat label="권리금 분쟁" v="38%" sub="매출 부풀리기" />
          <Stat label="임대차 분쟁" v="22%" sub="갱신 거부" />
          <Stat label="회원 환급" v="18%" sub="정책 변경" />
        </div>
        <Link href="/why" className="mt-5 inline-block rounded-md bg-rose-700 px-4 py-2 text-sm font-bold text-white hover:bg-rose-800">분쟁 6대 유형 + 실사 4축 자세히 →</Link>
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

      {/* 빠른 탐색 — 위치 / SNS / 매출 */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold">빠른 탐색</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <ExploreCard title="📍 지역별" desc="시군구 별 매물 + 시세 분포" links={[
            { label: "강남구", href: "/listings?sigungu=강남구" },
            { label: "서초구", href: "/listings?sigungu=서초구" },
            { label: "송파구", href: "/listings?sigungu=송파구" },
            { label: "마포구", href: "/listings?sigungu=마포구" },
          ]} />
          <ExploreCard title="🌐 SNS 운영" desc="네이버·카톡·인스타·블로그 다 갖춘 매장" links={[
            { label: "네이버 보유", href: "/listings?has_naver=1" },
            { label: "카톡채널 보유", href: "/listings?has_kchan=1" },
            { label: "인스타 운영", href: "/listings?has_insta=1" },
            { label: "리뷰 활성", href: "/listings?has_rev=1" },
          ]} />
          <ExploreCard title="💰 추정 매출" desc="권리금·수익률·인수가 기준" links={[
            { label: "수익률 8%+", href: "/listings?yield_min=8&sort=yield_desc" },
            { label: "권리금 5천 이하", href: "/listings?key_max=5000&sort=key_asc" },
            { label: "회수 12개월 이하", href: "/listings?payback_max=12" },
            { label: "인수가 1억 이하", href: "/listings?total_max=10000" },
          ]} />
        </div>
      </section>

      {/* 시군구 칩 */}
      <section className="mt-12">
        <h2 className="mb-3 text-lg font-bold">시군구 매물</h2>
        <div className="flex flex-wrap gap-2">
          {s.by_sigungu.slice(0, 18).map((r) => (
            <Link key={`${r.sido}-${r.sigungu}`} href={`/listings?sigungu=${encodeURIComponent(r.sigungu)}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm hover:bg-gray-50">
              {r.sigungu} <span className="text-gray-400">({r.count})</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 시도 분포 */}
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

function Stat({ label, v, sub }: { label: string; v: string; sub: string }) {
  return (
    <div className="rounded-lg bg-white border border-rose-200 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-rose-700">{v}</div>
      <div className="text-[11px] text-gray-500">{sub}</div>
    </div>
  );
}

function ExploreCard({ title, desc, links }: { title: string; desc: string; links: { label: string; href: string }[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="mt-1 text-xs text-gray-500">{desc}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {links.map((l) => (
          <Link key={l.label} href={l.href} className="rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100">{l.label}</Link>
        ))}
      </div>
    </div>
  );
}
