import Link from "next/link";

export const metadata = {
  title: "5단계 인수 절차",
  description: "매물 찾기 → 권리금 계산 → 실사 → 변호사 마무리 → 1년 점검. 단계마다 결정·결제·환불 시점이 명확합니다.",
};

const STAGES = [
  {
    n: 0,
    name: "매물 찾기·상담 신청",
    pill: "무료",
    color: "blue",
    duration: "수일",
    buyer: "매물 검색 + 상담 신청 (휴대폰만)",
    seller: "매장 등록 + 매도 의향 표명 (무료)",
    we: "운영팀이 양측 매칭, 카톡으로 의사 확인",
    gate: "양측 모두 \"다음 단계 진행 의사\" 카톡으로 확인",
  },
  {
    n: 1,
    name: "권리금 계산서 만들기",
    pill: "착수금 — 매도자",
    color: "amber",
    duration: "7영업일",
    buyer: "비용 0 (매도자가 착수금 부담)",
    seller: "착수금 150만원 결제 → 계산서 제작 진행",
    we: "POS·카드·세금계산서 통합 + 회원권 부채 산정 + 적정 권리금 의견 보고서",
    gate: "양측이 보고서 확인 후 \"적정 권리금 ± 10% 범위에서 협상 의사\" 카톡으로 확인",
    note: "보고서 결과 보고 그만 두셔도 착수금은 환불되지 않습니다 (작업이 진행된 부분).",
  },
  {
    n: 2,
    name: "실사·자료 검토",
    pill: "예약금 — 매수자",
    color: "amber",
    duration: "2~3주",
    buyer: "예약금 50만원 결제 → 비밀유지 약속 후 진성 자료 수령",
    seller: "추가 비용 0 (자료 제출에 협조)",
    we: "변호사 1차 상담 매칭, 자료 정리, 임대인 연락 대행",
    gate: "매수자분이 자료 본 후 \"이 가격에 인수 의사\" 결정",
    note: "매수자가 단순 변심하시면 예약금은 환불되지 않습니다 (이미 자료가 공개됨).",
  },
  {
    n: 3,
    name: "계약 · 잔금",
    pill: "성공 보수 — 매도자",
    color: "green",
    duration: "2주",
    buyer: "변호사·세무사·공증사무소에 직접 결제 (외부)",
    seller: "성공 보수 — 권리금의 2~4% (구간별 슬라이딩)",
    we: "일정 조율, 자료 전달 (변호사 자문료에는 일절 관여 X)",
    gate: "잔금 지급 + 인수 완료",
    note: "변호사법 제109조 준수 — 변호사·세무사가 의뢰인에게 직접 청구합니다.",
  },
  {
    n: 4,
    name: "1년간 사후 점검",
    pill: "무료",
    color: "blue",
    duration: "12개월",
    buyer: "비용 0",
    seller: "비용 0",
    we: "3·6·12개월에 카톡으로 점검 (회원·매출·임대·강사·세금)",
    gate: "—",
    note: "분쟁이 발생하면 변호사 1차 상담을 매칭해드립니다 (자문료는 변호사가 직접 청구).",
  },
];

const colorMap = {
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-black text-white",
  green: "bg-blue-100 text-blue-700",
};

export default function Process() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-2xl px-5 pt-14 pb-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">5단계 인수 절차</div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
          단계마다 <span className="text-blue-600">결정·결제·환불</span>이<br />명확합니다.
        </h1>
        <p className="mt-5 text-base text-black/65 leading-relaxed">
          착수금 → 예약금 → 성공 보수, 그리고 변호사·세무사 비용은 별도로 분리. 각 단계마다 그만 두실 수 있고, 비용은 그 단계까지만 받습니다.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-12">
        <div className="space-y-5">
          {STAGES.map((s) => (
            <div key={s.n} className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black text-lg font-extrabold text-white">{s.n}</div>
                  <h2 className="text-xl font-extrabold text-black">{s.name}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${colorMap[s.color as keyof typeof colorMap]}`}>{s.pill}</span>
              </div>

              <div className="text-xs font-bold text-black/55 mb-3">진행 기간 — {s.duration}</div>

              <div className="space-y-2 text-sm">
                <Row label="매수자" value={s.buyer} />
                <Row label="매도자" value={s.seller} />
                <Row label="pilaos" value={s.we} />
              </div>

              {s.gate !== "—" ? (
                <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-900">
                  <strong>다음 단계 진입 조건:</strong> {s.gate}
                </div>
              ) : null}

              {s.note ? (
                <p className="mt-3 text-[11px] text-black/55 leading-relaxed">※ {s.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-12">
        <div className="rounded-2xl bg-black p-7 text-white text-center">
          <h3 className="text-2xl font-extrabold leading-snug">
            먼저 <span className="text-blue-400">0단계 무료 상담</span>부터.
          </h3>
          <p className="mt-3 text-sm text-white/75">휴대폰만 남기시면 24시간 안에 카톡으로 연락드립니다.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/inquire?kind=acquire" className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">상담 신청 →</Link>
            <Link href="/pricing" className="rounded-lg border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">비용 자세히</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-16 flex-shrink-0 text-xs font-bold text-black/55">{label}</div>
      <div className="flex-1 text-black/85">{value}</div>
    </div>
  );
}
