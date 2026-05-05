import Link from "next/link";

export const metadata = {
  title: "매각 — 진단부터 거래까지 한 번에",
  description: "필라테스 매장 매각 한 페이지에 다 — 60초 권리금 진단, 5단계 절차, 비용 안내, 변호사 자문.",
};

export default function SellPage() {
  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="mx-auto max-w-3xl px-5 pt-14 pb-10 sm:pt-20">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">매각 · 원큐 funnel</div>
        <h1 className="mt-3 text-[34px] sm:text-[52px] font-extrabold leading-[1.05] tracking-tight">
          진단부터 등록까지<br />
          <span className="text-blue-600">원큐에 가자.</span>
        </h1>
        <p className="mt-5 text-[16px] sm:text-[18px] text-black/65 leading-relaxed">
          간이 진단 → 프로 진단 → 지원사업 자격 → 매물 등록까지 한 흐름. 입력하신 정보는 다음 단계로 자동 전달.
        </p>

        {/* 원큐 funnel 시각화 */}
        <div className="mt-7 rounded-xl border-2 border-black bg-white p-4 sm:p-5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">원큐 흐름</div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
            <FunnelStep n="1" label="간이 진단" detail="60초 · 무료" active />
            <FunnelStep n="2" label="프로 진단" detail="5~10분 · ₩9,900 LIVE" />
            <FunnelStep n="3" label="지원사업 자격" detail="13종 자동 매칭" />
            <FunnelStep n="4" label="매각/폐업 등록" detail="1-click 인계" />
          </div>
          <div className="mt-3 text-[11px] text-black/50 leading-relaxed">
            * 각 단계 입력값이 다음 단계로 자동 전달 — 같은 정보 두 번 입력 X.
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <CtaCard
            href="/diagnostic/#stage1"
            kicker="60초 무료"
            title="권리금 간이 진단"
            desc="입력 6개 → LOW–MID–HIGH 범위. 매각 vs 폐업 비교까지."
            primary
          />
          <CtaCard
            href="/inquire?kind=live_report&src=sell"
            kicker="₩ 9,900"
            title="LIVE 리포트 PDF"
            desc="매장 주가 PDF + 7일 what-if 시뮬레이터 + 권리금 변동 카톡 알림."
            paid
          />
          <CtaCard
            href="/sell/new"
            kicker="매각 의향"
            title="매물 등록"
            desc="기본 정보만. 운영팀이 카톡으로 다음 단계 안내."
          />
        </div>
      </section>

      {/* 절차 */}
      <section id="process" className="border-t border-black/10 bg-black/[.02] scroll-mt-16">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">5단계 절차</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            매각은 <span className="text-blue-600">단계로 끊어서</span> 진행
          </h2>
          <p className="mt-4 text-[14px] text-black/65 leading-relaxed">
            단계마다 결제·환불·게이트가 명확. 사장님이 중간에 멈추셔도 다음 단계로 넘어가지 않습니다.
          </p>

          <div className="mt-8 space-y-3">
            <StageCard
              n={0}
              name="진단·등록"
              pill="무료"
              pillColor="blue"
              duration="즉시"
              what="60초 진단 + 매장 기본정보 등록"
              gate="운영팀 카톡 회신 후 다음 단계 진행 의사 확인"
            />
            <StageCard
              n={1}
              name="권리금 계산서"
              pill="착수금 150만"
              pillColor="paid"
              duration="7영업일"
              what="POS·카드·세금계산서로 진성 매출 확인 + 회원권 부채 산정 + 적정 권리금 보고서"
              gate="양측이 보고서 본 후 ±10% 협상 의사 확인"
              note="보고서 결과 보고 그만두셔도 착수금은 환불 X (이미 작업이 완료됨)"
            />
            <StageCard
              n={2}
              name="실사·자료 검토"
              pill="매수자 부담"
              pillColor="paid"
              duration="2~3주"
              what="매수자가 디파짓 50만 결제 → 비밀유지 약속 후 진성 자료 일체 수령"
              gate={`매수자가 자료 본 후 "이 가격에 인수" 의사 확정`}
            />
            <StageCard
              n={3}
              name="계약·잔금"
              pill="성공보수"
              pillColor="success"
              duration="2주"
              what="변호사 자문 + 회원권 정리 + 임대인 연락 대행"
              gate="잔금 지급 + 인수 완료"
              note="변호사·세무사 비용은 별도 (의뢰인이 직접 결제)"
            />
            <StageCard
              n={4}
              name="1년 사후 점검"
              pill="무료"
              pillColor="blue"
              duration="12개월"
              what="인수자 정착 + 회원 분쟁 발생 시 매도자 책임 한계 자문"
            />
          </div>
        </div>
      </section>

      {/* 비용 */}
      <section id="cost" className="border-t border-black/10 bg-white scroll-mt-16">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">비용</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            진단은 무료. <span className="text-blue-600">결제는 단계별로</span>
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <CostCard
              when="진단·등록"
              amount="0원"
              detail="진단기 사용 + 매물 등록 + 운영팀 카톡 상담 — 무료"
            />
            <CostCard
              when="권리금 계산서 (Stage 1)"
              amount="150만"
              detail="POS·카드·세금계산서 통합 분석 + 회원권 부채 산정 + 보고서"
            />
            <CostCard
              when="성공보수 (거래 시)"
              amount="권리금의 2~4%"
              detail="구간별 슬라이딩 적용. 정확한 견적은 진단 후 안내"
              accent
            />
            <CostCard
              when="변호사·세무사"
              amount="별도"
              detail="의뢰인이 직접 결제 (변호사법 제109조). 우리는 매칭만"
            />
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-[13px] text-blue-900 leading-relaxed">
            <strong>정확한 견적은 진단 후 안내드립니다.</strong> 매장 규모·회원수·잔여 임대 등에 따라 달라지며, 가격표를 일괄 공개하지 않는 이유는 작은 매장에 큰 매장 기준 비용을 적용하지 않기 위해서입니다.
          </div>
        </div>
      </section>

      {/* 변호사 연계 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">변호사 자문 연계</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            폐업이 답일 때, <span className="text-blue-600">회원 환불 협상</span>이 진짜 돈
          </h2>
          <p className="mt-4 text-[14px] text-black/65 leading-relaxed">
            진단기 시나리오 B의 회원 환불 협상률 슬라이더를 100%(협상 없음)에서 50%(변호사 협상)로 바꾸면 적자가 흑자로 전환되는 가게가 많습니다. 이 차액이 변호사 자문의 정량적 가치입니다.
          </p>

          <div className="mt-7 rounded-2xl border-2 border-black bg-white p-7">
            <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">웰컴법률사무소</div>
            <div className="mt-2 text-xl font-extrabold">양 변호사 — 회원제 사업장 정리 전문</div>
            <p className="mt-4 text-[14px] text-black/70 leading-relaxed">
              필라테스·요가·헬스장 등 회원권 환불 협상 평균 50~70% 감축. 진단 결과 PDF 지참 시 초기 상담 무료.
            </p>
            <Link href="/inquire?kind=closure" className="mt-5 inline-block rounded-md bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-black/85">
              상담 신청 →
            </Link>
          </div>
        </div>
      </section>

      {/* 마지막 CTA */}
      <section className="border-t border-black/10 bg-black text-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <h2 className="text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            먼저 60초만<br />
            <span className="text-blue-400">써보세요.</span>
          </h2>
          <p className="mt-4 text-[14px] text-white/70 leading-relaxed">
            가입 없음. 권리금 LOW–MID–HIGH 범위 즉시 산출.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 items-center">
            <Link href="/diagnostic/#stage1" className="inline-block rounded-md bg-blue-500 px-6 py-3 text-sm font-bold text-white hover:bg-blue-400">권리금 진단 →</Link>
            <Link href="/sell/new" className="text-sm text-blue-400 underline hover:text-blue-300">바로 매물 등록</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function FunnelStep({ n, label, detail, active }: { n: string; label: string; detail: string; active?: boolean }) {
  const bg = active ? "bg-black text-white" : "bg-blue-50 text-blue-700";
  return (
    <div className={`rounded-lg ${active ? "border-2 border-black" : "border border-black/10"} bg-white p-3`}>
      <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${bg} text-[11px] font-extrabold`}>{n}</div>
      <div className="mt-2 text-[12.5px] font-extrabold">{label}</div>
      <div className="mt-1 text-[10.5px] text-black/55">{detail}</div>
    </div>
  );
}

function CtaCard({ href, kicker, title, desc, primary, paid }: { href: string; kicker: string; title: string; desc: string; primary?: boolean; paid?: boolean }) {
  const border = primary ? "border-black" : paid ? "border-blue-600 bg-blue-50/30" : "border-black/15";
  const kickerColor = paid ? "text-blue-700" : "text-blue-600";
  return (
    <Link href={href} className={`block rounded-2xl border-2 ${border} bg-white p-6 hover:border-blue-600 transition-colors`}>
      <div className={`text-[11px] font-bold uppercase tracking-widest ${kickerColor}`}>{kicker}</div>
      <div className="mt-2 text-[18px] font-extrabold leading-tight">{title}</div>
      <div className="mt-3 text-[13px] text-black/65 leading-relaxed">{desc}</div>
      <div className={`mt-4 text-[13px] font-bold ${paid ? "text-blue-700" : "text-blue-600"}`}>{paid ? "결제하기 →" : "시작하기 →"}</div>
    </Link>
  );
}

function StageCard({ n, name, pill, pillColor, duration, what, gate, note }: { n: number; name: string; pill: string; pillColor: "blue" | "paid" | "success"; duration: string; what: string; gate?: string; note?: string }) {
  // blue (무료/시작) / black (유료) / blue-600 (성공) — 흑+blue+red 시스템
  const pillCls = {
    blue: "bg-blue-50 text-blue-700",
    paid: "bg-black text-white",
    success: "bg-blue-600 text-white",
  }[pillColor];
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <div className="flex items-baseline gap-3 flex-wrap">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-black text-[12px] font-extrabold text-white">{n}</div>
        <div className="text-[16px] font-extrabold">{name}</div>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${pillCls}`}>{pill}</span>
        <span className="text-[11px] text-black/45">소요 {duration}</span>
      </div>
      <div className="mt-3 text-[13.5px] text-black/75 leading-relaxed">{what}</div>
      {gate && (
        <div className="mt-2 text-[12px] text-black/55">
          <strong className="text-black/70">게이트.</strong> {gate}
        </div>
      )}
      {note && (
        <div className="mt-2 text-[12px] text-red-600 leading-snug">
          <strong>주의.</strong> {note}
        </div>
      )}
    </div>
  );
}

function CostCard({ when, amount, detail, accent }: { when: string; amount: string; detail: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border ${accent ? "border-2 border-black" : "border-black/10"} bg-white p-5`}>
      <div className="text-[11px] font-bold text-black/55 uppercase tracking-wide">{when}</div>
      <div className={`mt-2 text-[22px] font-extrabold ${accent ? "text-blue-600" : "text-black"}`}>{amount}</div>
      <div className="mt-2 text-[12.5px] text-black/65 leading-relaxed">{detail}</div>
    </div>
  );
}
