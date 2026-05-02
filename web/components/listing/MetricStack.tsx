import { Listing } from "@/lib/types";
import { fmtMan } from "@/lib/estimate";

export function MetricStack({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  const e = listing.estimate;
  const items = [
    { label: "권리금", value: fmtMan(e.key_money.mid), sub: `${fmtMan(e.key_money.low)}–${fmtMan(e.key_money.high)}` },
    { label: "월매출", value: fmtMan(e.monthly_revenue.mid), sub: `${fmtMan(e.monthly_revenue.low)}–${fmtMan(e.monthly_revenue.high)}` },
    { label: "월순익", value: fmtMan(e.monthly_profit.mid), sub: `${fmtMan(e.monthly_profit.low)}–${fmtMan(e.monthly_profit.high)}` },
    { label: "월수익률", value: `${e.monthly_yield_pct}%`, sub: `연 ${e.annual_roi_pct}%` },
    { label: "회수기간", value: e.payback_months_keyMoney >= 999 ? "—" : `${e.payback_months_keyMoney}개월`, sub: `총투자 ${e.payback_months_total >= 999 ? "—" : e.payback_months_total + "개월"}` },
  ];
  return (
    <div className={`grid ${compact ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-5"} gap-2`}>
      {items.map((it) => (
        <div key={it.label} className="rounded-lg bg-black/[.03] px-3 py-2">
          <div className="text-[10px] uppercase tracking-wide text-black/55">{it.label}</div>
          <div className={`mt-0.5 ${compact ? "text-sm" : "text-base"} font-bold text-black`}>{it.value}</div>
          {!compact ? <div className="text-[10px] text-black/40 mt-0.5 truncate">{it.sub}</div> : null}
        </div>
      ))}
    </div>
  );
}
