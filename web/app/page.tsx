import Link from "next/link";
import { summary } from "@/lib/listings";

export default function Home() {
  const s = summary();

  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">필라테스 매장 OS · LIVE</div>
        <h1 className="mt-4 text-[36px] sm:text-[56px] font-extrabold leading-[1.05] tracking-tight">
          내 가게 권리금,<br />
          <span className="text-blue-600">지금 얼마?</span>
        </h1>
        <p className="mt-6 text-[16px] sm:text-[18px] text-black/65 leading-relaxed">
          매주 갱신되는 매장 주가 트래킹. {s.total.toLocaleString()}개 매물 시세 기반. 사장님 입력 6개면 권리금 LIVE 차트가 시작됩니다.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Pillar
            href="/listings"
            kicker="스페이스"
            title="매물 보러가기"
            desc={`${s.total.toLocaleString()}+곳 자동 발굴`}
            primary
          />
          <Pillar
            href="/sell"
            kicker="매각 · ₩9,900부터"
            title="내 가게 얼마"
            desc="60초 무료 진단 → ₩9,900 LIVE PDF → 매각 5단계"
          />
          <Pillar
            href="/manage"
            kicker="매장 관리 · LIVE"
            title="권리금 ▲ 매주 갱신"
            desc="₩2.04억 → 매주 자동 트래킹. 마이너스 시 폐업 1-click."
            beta
          />
        </div>
      </section>

      {/* WHY SaaS — 차별화 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">왜 다른가</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            매물 중개가 아니라,<br />
            <span className="text-blue-600">매장의 OS.</span>
          </h2>
          <p className="mt-4 text-[14px] sm:text-[15px] text-black/65 leading-relaxed">
            기존 중개 플랫폼은 매물만. 우리는 매장 운영(회원·매출·강사 관리)부터 매각·인수·1년 점검까지 매장의 생애주기를 같이 갑니다.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Diff title="운영" desc="회원권 관리 · 매출 분석 · 강사 정산 (베타)" />
            <Diff title="매각" desc="60초 진단 + 5단계 절차 + 변호사 자문 연계" />
            <Diff title="인수" desc="진성 매출 검증 + 위험 7가지 사전 체크 + 1년 점검" />
          </div>
        </div>
      </section>

      {/* 무엇이 들어 있나 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">기능 요약</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            지금 바로 <span className="text-blue-600">쓸 수 있는 것</span>
          </h2>

          <div className="mt-8 space-y-3">
            <Feat n="01" title="스페이스 검색" desc={`카카오·네이버·점포라인 통합. ${s.total.toLocaleString()}+곳 자동 동기화.`} href="/listings" />
            <Feat n="02" title="권리금 진단기" desc="60초 입력 → LOW–MID–HIGH 범위. 매각 vs 폐업 vs 6개월후 비교까지." href="/diagnostic/" />
            <Feat n="03" title="지원사업 매칭" desc="희망리턴·새출발기금 등 13종 자격 자동 체크 + 신청 직링크." href="/diagnostic/#stage4" />
            <Feat n="04" title="매각 5단계 절차" desc="진단 → 계산서 → 실사 → 계약 → 1년 점검. 단계별 결제·환불 명확." href="/sell#process" />
            <Feat n="05" title="매장 관리 SaaS" desc="회원·매출·강사 통합. 베타 신청 받는 중." href="/manage" beta />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black/10 bg-black text-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <h2 className="text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            카톡 한 채널로 <span className="text-blue-400">전부.</span>
          </h2>
          <p className="mt-4 text-[14px] text-white/70 leading-relaxed">
            매수·매도·운영 어느 입구로 들어와도 운영팀 1명이 끝까지.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 items-center">
            <Link href="/inquire?kind=acquire" className="inline-block rounded-md bg-blue-500 px-6 py-3 text-sm font-bold text-white hover:bg-blue-400">상담 신청 →</Link>
            <Link href="/diagnostic/#stage1" className="text-sm text-blue-400 underline hover:text-blue-300">진단 먼저</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function Pillar({ href, kicker, title, desc, primary, beta }: { href: string; kicker: string; title: string; desc: string; primary?: boolean; beta?: boolean }) {
  const border = primary ? "border-black" : "border-black/15";
  return (
    <Link href={href} className={`block rounded-2xl border-2 ${border} bg-white p-6 hover:border-blue-600 transition-colors`}>
      <div className="flex items-center gap-2">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">{kicker}</div>
        {beta && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black text-white">BETA</span>}
      </div>
      <div className="mt-2 text-[18px] font-extrabold leading-tight">{title}</div>
      <div className="mt-2 text-[12.5px] text-black/65 leading-relaxed">{desc}</div>
    </Link>
  );
}

function Diff({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <div className="text-[15px] font-extrabold">{title}</div>
      <div className="mt-2 text-[12.5px] text-black/65 leading-relaxed">{desc}</div>
    </div>
  );
}

function Feat({ n, title, desc, href, beta }: { n: string; title: string; desc: string; href: string; beta?: boolean }) {
  return (
    <Link href={href} className="block rounded-xl border border-black/10 bg-white p-5 hover:border-blue-600 transition-colors">
      <div className="flex items-baseline gap-3 flex-wrap">
        <div className="text-[11px] font-bold text-black/45">{n}</div>
        <div className="text-[15px] font-extrabold">{title}</div>
        {beta && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black text-white">BETA</span>}
        <span className="ml-auto text-[12px] font-bold text-blue-600">→</span>
      </div>
      <div className="mt-2 text-[13px] text-black/65 leading-relaxed">{desc}</div>
    </Link>
  );
}
