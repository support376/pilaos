export function RevenueBar() {
  return (
    <div className="space-y-3">
      <Row label="매도자가 말한 월매출" value={8000} max={8000} color="black" tag="자랑" />
      <Row label="POS·카드 검증 실제 월매출" value={4200} max={8000} color="red" tag="검증" />
      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-900 leading-relaxed">
        <strong>차이 3,800만원/월 → 연 4억 5천 차이.</strong><br />
        매도자 호가 권리금 1억 → 우리 산정 5,200만 (협상 기준).
      </div>
    </div>
  );
}

function Row({ label, value, max, color, tag }: { label: string; value: number; max: number; color: "black" | "red"; tag: string }) {
  const pct = (value / max) * 100;
  const bar = color === "red" ? "bg-red-600" : "bg-black";
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="text-[13px] font-bold text-black/85">{label}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] font-bold text-black/40 uppercase">{tag}</span>
          <span className="text-[15px] font-extrabold text-black">{value.toLocaleString()}<span className="text-[11px] text-black/55"> 만</span></span>
        </div>
      </div>
      <div className="h-3 rounded-full bg-black/5 overflow-hidden">
        <div className={`h-full ${bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
