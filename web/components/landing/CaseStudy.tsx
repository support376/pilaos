type Case = {
  who: string; role: string; region: string; quote: string;
  weeks: number; ask: string; final: string; saved: string;
  gender: "f" | "m";
};

const CASES: Case[] = [
  { who: "김OO 강사", role: "현직 강사 → 신모 필라테스 인수", region: "서울 강남구", quote: "월 4,500만 매출이라고 하셨는데, POS 검증해보니 2,800만이었어요. 그 자료가 협상에서 결정적이었습니다.", weeks: 7, ask: "9,500만", final: "6,200만", saved: "3,300만", gender: "f" },
  { who: "박OO 원장", role: "현직 원장 → 분점 인수", region: "경기 성남시", quote: "회원권 잠재 부채가 1,800만이었는데, 매도자가 전혀 모르고 있었어요. 인수 전에 알아내서 권리금 차감했습니다.", weeks: 6, ask: "1억 2천", final: "1억", saved: "2,000만", gender: "m" },
  { who: "이OO 예비창업자", role: "예비 창업자 → 첫 학원 인수", region: "부산 해운대구", quote: "변호사·세무사·은행 다 따로 다닐 자신이 없었어요. 카톡 한 채널로 다 정리되니까 진짜 편했습니다.", weeks: 8, ask: "5,500만", final: "5,500만", saved: "변호사 매칭+1년 점검", gender: "f" },
];

export function CaseStudySection() {
  return (
    <div className="space-y-3">
      {CASES.map((c, i) => <CaseCard key={i} c={c} />)}
    </div>
  );
}

function Silhouette({ gender }: { gender: "f" | "m" }) {
  // 단순 line drawing
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full">
      <circle cx="24" cy="17" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {gender === "f" ? (
        <path d="M11 42 C 11 30 16 26 24 26 C 32 26 37 30 37 42" fill="none" stroke="currentColor" strokeWidth="1.5" />
      ) : (
        <path d="M13 42 L 13 30 C 13 27 17 26 24 26 C 31 26 35 27 35 30 L 35 42" fill="none" stroke="currentColor" strokeWidth="1.5" />
      )}
    </svg>
  );
}

function CaseCard({ c }: { c: Case }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-blue-600 p-2">
          <Silhouette gender={c.gender} />
        </div>
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
