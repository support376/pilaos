const POINTS = [
  { week: "0주", label: "상담 신청", color: "blue" },
  { week: "1주", label: "권리금 산정", color: "blue" },
  { week: "3주", label: "실사·검토", color: "blue" },
  { week: "5주", label: "계약·잔금", color: "blue" },
  { week: "6주", label: "인수 완료", color: "black" },
  { week: "+3개월", label: "1차 점검", color: "blue" },
  { week: "+6개월", label: "2차 점검", color: "blue" },
  { week: "+12개월", label: "3차 점검", color: "blue" },
];

export function ProcessTimeline() {
  return (
    <div className="-mx-5 overflow-x-auto px-5 py-2 sm:mx-0 sm:px-0 sm:overflow-visible">
      <div className="relative flex min-w-[640px] sm:min-w-0">
        {/* 가로 라인 */}
        <div className="absolute left-2 right-2 top-3.5 h-[2px] bg-black/15" />
        {POINTS.map((p, i) => (
          <div key={i} className="relative flex-1 text-center px-1">
            <div className={`mx-auto h-3 w-3 rounded-full border-2 border-white ring-2 ${p.color === "black" ? "bg-black ring-black" : "bg-blue-600 ring-blue-600"} relative z-10`} />
            <div className="mt-2 text-[11px] font-extrabold text-black">{p.week}</div>
            <div className="mt-0.5 text-[10px] sm:text-[11px] text-black/65 leading-tight">{p.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-black/45 sm:px-1">
        <span className="font-bold">표준 6주</span>
        <span className="text-black/30">|</span>
        <span className="font-bold">사후 12개월 무료 점검</span>
      </div>
    </div>
  );
}
