import Link from "next/link";

export const metadata = {
  title: "5단계 인수 절차",
  description: "발견 → 권리금 산정 → 실사 → 클로징 → 1년 점검. 단계마다 결정·결제·환불 명확.",
};

const STAGES = [
  {
    n: 0,
    name: "발견 · 의사 표현",
    pill: "무료",
    color: "blue",
    duration: "수일",
    buyer: "매물 검색 + 무료 상담 신청 (휴대폰만)",
    seller: "매장 등록 + 무료 (매도 의향 표명)",
    we: "운영팀 양측 매칭, 카톡으로 의사 확인",
    gate: "양측 모두 \"다음 단계 진행 의사\" 카톡 확인",
  },
  {
    n: 1,
    name: "권리금 산정",
    pill: "Retainer",
    color: "amber",
    duration: "7영업일",
    buyer: "결제 X (매도자가 retainer 부담)",
    seller: "Retainer 150만원 결제 → 데이터팩 제작",
    we: "POS·카드·세금계산서 통합 + 회원권 부채 산정 + 적정 권리금 PDF",
    gate: "양측이 PDF 결과 본 후 \"적정 권리금 ± 10% 범위에서 협상 의사\" 카톡 확인",
    note: "결과 본 후 그만 두셔도 retainer는 환불 X (작업 진행분).",
  },
  {
    n: 2,
    name: "실사 진입",
    pill: "Deposit",
    color: "amber",
    duration: "2~3주",
    buyer: "디파짓 50만원 결제 → NDA + 진성정보 + 변호사·세무사 매칭",
    seller: "추가 비용 0 (자료 제출 협조)",
    we: "변호사 1차 컨설팅 매칭, 자료 정리, 임대인 연락 대행",
    gate: "매수자가 데이터·자료 본 후 \"이 가격에 인수 의사\" 결정",
    note: "매수자 단순 변심 시 디파짓 환불 X (이미 NDA·자료 진행).",
  },
  {
    n: 3,
    name: "계약 · 잔금",
    pill: "Success Fee",
    color: "green",
    duration: "2주",
    buyer: "변호사·세무사·공증 비용 직접 결제 (외부)",
    seller: "Success Fee — 권리금의 2~4% 슬라이딩",
    we: "일정 조율, 자료 전달 (자문료에 일절 관여 X)",
    gate: "잔금 지급 + 인수 완료",
    note: "변호사법 §109 준수 — 변호사·세무사가 의뢰인에게 직접 청구.",
  },
  {
    n: 4,
    name: "1년 사후 점검",
    pill: "무료",
    color: "green",
    duration: "12개월",
    buyer: "비용 0",
    seller: "비용 0",
    we: "3·6·12개월 카톡 점검 (회원·매출·임대·강사·세금)",
    gate: "—",
    note: "분쟁 발생 시 변호사 1차 자문 매칭 (자문료는 변호사 직접).",
  },
];

const colorMap = {
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  green: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export default function ProcessPage() {
  return (
    <div className="bg-stone-50">
      <section className="mx-auto max-w-2xl px-5 pt-14 pb-10">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-700">5단계 인수 절차</div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          단계마다 <span className="text-amber-700">결정·결제·환불</span>이 명확합니다.
        </h1>
        <p className="mt-4 text-base text-stone-600 leading-relaxed">
          IB식 M&amp;A advisory 모델 — Engagement Retainer + Success Fee + 법률·세무 분리.<br />
          각 단계마다 그만 두실 수 있고, 비용은 그 단계까지만 받습니다.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-12">
        <div className="space-y-5">
          {STAGES.map((s) => (
            <div key={s.n} className="rounded-2xl border-2 border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-lg font-extrabold text-white">{s.n}</div>
                  <h2 className="text-xl font-bold">{s.name}</h2>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${colorMap[s.color as keyof typeof colorMap]}`}>{s.pill}</span>
              </div>

              <div className="text-xs font-bold text-stone-500 mb-2">기간: {s.duration}</div>

              <div className="space-y-2 text-sm">
                <Row label="매수자" value={s.buyer} />
                <Row label="매도자" value={s.seller} />
                <Row label="pilaos" value={s.we} />
              </div>

              {s.gate !== "—" ? (
                <div className="mt-4 rounded-lg border border-dashed border-amber-400 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                  <strong>다음 단계 진입 조건:</strong> {s.gate}
                </div>
              ) : null}

              {s.note ? (
                <p className="mt-3 text-[11px] text-stone-500 leading-relaxed">※ {s.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-12">
        <div className="rounded-2xl bg-stone-900 p-7 text-white text-center">
          <h3 className="text-2xl font-bold leading-snug">
            먼저 <span className="text-amber-400">Stage 0 무료 상담</span>부터 시작하세요.
          </h3>
          <p className="mt-3 text-sm text-stone-300">휴대폰만 남기면 24시간 내 카톡으로 인사드립니다.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link href="/inquire?kind=acquire" className="rounded-lg bg-amber-400 px-6 py-3 text-sm font-bold text-stone-900 hover:bg-amber-300">무료 상담 신청 →</Link>
            <Link href="/pricing" className="rounded-lg border border-stone-700 px-6 py-3 text-sm font-bold hover:bg-stone-800">가격 정책 보기</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-16 flex-shrink-0 text-xs font-bold text-stone-500">{label}</div>
      <div className="flex-1 text-stone-700">{value}</div>
    </div>
  );
}
