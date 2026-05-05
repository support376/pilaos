import Link from "next/link";

export const metadata = {
  title: "매장 관리 SaaS — 베타 신청",
  description: "필라테스 매장 운영 도구. 회원·매출·강사·환불부채 한 곳에서. 베타 출시 전 사전 신청 받습니다.",
};

export default function Manage() {
  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="mx-auto max-w-3xl px-5 pt-14 pb-8 sm:pt-20">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">매장 관리 · LIVE</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black text-white">BETA</span>
        </div>
        <h1 className="mt-3 text-[34px] sm:text-[52px] font-extrabold leading-[1.05] tracking-tight">
          내 매장 권리금,<br />
          <span className="text-blue-600">매주 다시.</span>
        </h1>
        <p className="mt-5 text-[16px] sm:text-[18px] text-black/65 leading-relaxed">
          회원·매출·강사 정산·환불부채가 권리금에 어떻게 영향 주는지 LIVE 트래킹. 매주 카톡 알림. 마이너스 신호 시 즉시 폐업 1-click.
        </p>
      </section>

      {/* LIVE 위젯 mock-up — 핵심 시각 증거 */}
      <section className="mx-auto max-w-3xl px-5 pb-12">
        <div className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">내 매장 권리금 LIVE</div>
              <div className="mt-1 text-[10px] text-black/45">예시 · 강남 30평 · 회원 65명</div>
            </div>
            <div className="text-[10px] text-black/45">매주 월요일 09:00 갱신</div>
          </div>

          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            <div className="text-[44px] sm:text-[56px] font-extrabold leading-none tracking-tight">₩ 2.04<span className="text-[22px] sm:text-[26px] text-black/55">억</span></div>
            <div className="rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[12px] font-bold px-2 py-1">▲ 1.2%</div>
          </div>
          <div className="mt-2 text-[13px] text-black/65">
            지난주 대비 <strong className="text-blue-600">+200만</strong> · 30일 <strong className="text-blue-600">+3,800만</strong> · 추세 ▲
          </div>

          {/* Sparkline (inline SVG) */}
          <div className="mt-4">
            <svg viewBox="0 0 320 60" className="w-full h-14" preserveAspectRatio="none">
              <polyline
                fill="none" stroke="#2563eb" strokeWidth="2"
                points="0,45 20,42 40,48 60,40 80,38 100,42 120,35 140,30 160,32 180,28 200,25 220,30 240,22 260,18 280,15 300,12 320,10"
              />
              <polyline
                fill="rgba(37,99,235,0.08)" stroke="none"
                points="0,45 20,42 40,48 60,40 80,38 100,42 120,35 140,30 160,32 180,28 200,25 220,30 240,22 260,18 280,15 300,12 320,10 320,60 0,60"
              />
            </svg>
            <div className="flex justify-between text-[10px] text-black/40 mt-1"><span>30일 전</span><span>오늘</span></div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-red-300 bg-red-50/40 p-2.5"><div className="text-[10px] text-red-700">회원 환불부채 ⚠</div><div className="mt-1 text-[14px] font-extrabold text-red-600">₩ 6,484만</div></div>
            <div className="rounded-lg border border-black/10 p-2.5"><div className="text-[10px] text-black/45">강사 의존</div><div className="mt-1 text-[14px] font-extrabold text-black">35% 점유</div></div>
            <div className="rounded-lg border border-black/10 p-2.5"><div className="text-[10px] text-black/45">잔여 임대</div><div className="mt-1 text-[14px] font-extrabold text-black">12개월</div></div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/diagnostic/#stage1" className="inline-block rounded-md bg-black px-4 py-2 text-xs font-bold text-white hover:bg-black/85">내 매장 LIVE 시작 (60초) →</Link>
            <Link href="/inquire?kind=manage&src=manage_live" className="inline-block rounded-md border border-black/20 bg-white px-4 py-2 text-xs font-bold text-black hover:border-black/40">베타 사전 신청 (휴대폰만)</Link>
          </div>

          <div className="mt-4 text-[11px] text-black/45 leading-relaxed">
            * 위 위젯은 예시 데이터. 사장님 매장 실제 LIVE는 진단 1회 후 자동 시작 — 이후 매주 갱신, 권리금 변동/회원 환불 위험/지원사업 마감 시 카톡 알림.
          </div>
        </div>
      </section>

      {/* 무엇이 들어가나 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">기능 (베타 우선 공급 순서)</div>
          <h2 className="mt-3 text-[24px] sm:text-[28px] font-extrabold leading-tight tracking-tight">
            기존 회원관리 툴이 <span className="text-blue-600">못 하는 것</span>
          </h2>
          <p className="mt-3 text-[14px] text-black/65 leading-relaxed">
            기존 도구는 회원 명단 + 결제 + 출석만. 매장의 <strong className="text-black">매각 가치·환불 부채·운영 적자</strong>는 못 봅니다. 우리는 그 셋이 메인.
          </p>

          <div className="mt-8 space-y-3">
            <FeatRow n="01" name="실시간 권리금 트래킹" desc="회원수·매출·잔여 임대 변동 시 권리금이 실시간으로 변하는 걸 확인. 진단기와 동일 엔진." />
            <FeatRow n="02" name="회원 환불부채 자동 산정" desc="회원별 잔여 회차 × 단가 기반. 위약금·차지백 리스크까지 반영." />
            <FeatRow n="03" name="강사 정산 + 매출 점유율" desc="수석강사 매출 비중 자동 계산 → 이탈 리스크 알림." />
            <FeatRow n="04" name="POS·카드사 연동" desc="진성 매출 자동 검증. 매각 시 매수자에게 그대로 전달." />
            <FeatRow n="05" name="지원사업 알림" desc="자격 변동 시 지원사업 자동 매칭 (희망리턴·실업급여 등 13종)." />
            <FeatRow n="06" name="원클릭 매물 등록" desc="버튼 한 번으로 진단 결과 + 운영 데이터 → 매물 카드 + PDF 보고서." />
          </div>
        </div>
      </section>

      {/* 베타 신청 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">베타 사전 신청</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            첫 100명 <span className="text-blue-600">평생 무료</span>
          </h2>
          <p className="mt-4 text-[14px] text-black/65 leading-relaxed">
            정식 출시 전 사용 + 피드백 주신 매장에는 평생 무료. 휴대폰만 남기시면 출시 시 카톡으로 알려드립니다.
          </p>

          <div className="mt-7 rounded-2xl border-2 border-black bg-white p-7">
            <div className="text-[14px] font-bold">출시 알림 받기</div>
            <p className="mt-2 text-[13px] text-black/60">
              지금은 사전 신청 폼만 운영 중입니다. 정식 폼 작업 후 카톡 채널로 1:1 안내됩니다.
            </p>
            <Link
              href="/inquire?kind=manage&src=manage_landing"
              className="mt-5 inline-block rounded-md bg-black px-6 py-3 text-sm font-bold text-white hover:bg-black/85"
            >
              사전 신청 (휴대폰만) →
            </Link>
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-[13px] text-blue-900 leading-relaxed">
            <strong>왜 베타인가요?</strong> 매장 데이터 연동(POS·회원관리)은 매장마다 환경이 달라서 한 번에 모두 지원이 어렵습니다. 첫 100명과 1:1로 맞춰가며 개발합니다.
          </div>
        </div>
      </section>

      {/* 매각 동선 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <h2 className="text-[22px] sm:text-[26px] font-extrabold leading-tight tracking-tight">
            지금 매각 생각이 더 급하신가요?
          </h2>
          <p className="mt-3 text-[14px] text-black/65 leading-relaxed">
            매장 관리 SaaS는 베타 — 운영 중 매각이 급한 사장님은 진단기부터 바로.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/diagnostic/#stage1" className="inline-block rounded-md bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-black/85">권리금 진단 →</Link>
            <Link href="/sell" className="inline-block rounded-md border border-black/20 bg-white px-5 py-2.5 text-sm font-bold text-black hover:border-black/40">매각 절차 보기</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function FeatRow({ n, name, desc }: { n: string; name: string; desc: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <div className="flex items-baseline gap-3">
        <div className="text-[11px] font-bold text-black/45">{n}</div>
        <div className="text-[15px] font-extrabold">{name}</div>
      </div>
      <div className="mt-2 text-[13px] text-black/65 leading-relaxed">{desc}</div>
    </div>
  );
}
