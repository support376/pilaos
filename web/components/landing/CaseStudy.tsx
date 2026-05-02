type Case = {
  who: string;
  role: string;
  region: string;
  quote: string;
  weeks: number;
  ask: string;
  final: string;
  saved: string;
};

const CASES: Case[] = [
  {
    who: "김OO 강사",
    role: "현직 강사 → 신모 필라테스 인수",
    region: "서울 강남구",
    quote: "월 4,500만 매출이라고 하셨는데, POS 검증해보니 2,800만이었어요. 그 자료가 협상에서 결정적이었습니다.",
    weeks: 7,
    ask: "9,500만",
    final: "6,200만",
    saved: "3,300만",
  },
  {
    who: "박OO 원장",
    role: "현직 원장 → 분점 인수",
    region: "경기 성남시",
    quote: "회원권 잠재 부채가 1,800만이었는데, 매도자가 전혀 모르고 있었어요. 인수 전에 알아내서 권리금 차감했습니다.",
    weeks: 6,
    ask: "1억 2천",
    final: "1억",
    saved: "2,000만",
  },
  {
    who: "이OO 예비창업자",
    role: "예비 창업자 → 첫 학원 인수",
    region: "부산 해운대구",
    quote: "변호사·세무사·은행 다 따로 다닐 자신이 없었어요. 카톡 한 채널로 다 정리되니까 진짜 편했습니다.",
    weeks: 8,
    ask: "5,500만",
    final: "5,500만",
    saved: "변호사 매칭+1년 점검",
  },
];

export function CaseStudySection() {
  return (
    <div className="space-y-3">
      {CASES.map((c, i) => <CaseCard key={i} c={c} />)}
    </div>
  );
}

function CaseCard({ c }: { c: Case }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-black text-[15px] font-extrabold text-white">{c.who.slice(0, 1)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[15px] font-extrabold text-black">{c.who}</span>
            <span className="text-[11px] text-black/55">{c.region}</span>
          </div>
          <div className="text-[12px] text-black/65">{c.role}</div>
        </div>
      </div>

      <blockquote className="mt-4 rounded-xl bg-black/[.03] px-4 py-3 text-[13px] text-black/85 leading-relaxed">
        “{c.quote}”
      </blockquote>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat label="진행 기간" value={`${c.weeks}주`} />
        <Stat label="매도자 호가" value={c.ask} mute />
        <Stat label="최종 권리금" value={c.final} highlight />
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-[11px]">
        <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 font-bold text-blue-700">절감 / 가치 {c.saved}</span>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight, mute }: { label: string; value: string; highlight?: boolean; mute?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-black/40 uppercase">{label}</div>
      <div className={`mt-0.5 text-[15px] font-extrabold ${highlight ? "text-blue-600" : mute ? "text-black/40 line-through" : "text-black"}`}>
        {value}
      </div>
    </div>
  );
}
