import { Listing } from "@/lib/types";
import { fmtMan, confidenceLabel } from "@/lib/estimate";
import { ConfidencePill } from "./ConfidencePill";

export function EstimateBasis({ listing }: { listing: Listing }) {
  const e = listing.estimate;
  const s = listing.studio;

  const rows = [
    {
      label: "활성 회원수",
      value: `${e.member_count.mid.toLocaleString()}명`,
      basis: `리뷰 활동 + 사진 보너스 + 디지털 점수 ${listing.digital_score}/90 × 시군구 가중`,
      range: `${e.member_count.low.toLocaleString()} ~ ${e.member_count.high.toLocaleString()}명`,
    },
    {
      label: "평균 월 회비",
      value: s.menu_price_min && s.menu_price_max
        ? `${Math.round(((s.menu_price_min + s.menu_price_max) / 2) / 10000)}만원`
        : "약 25만원",
      basis: s.menu_count
        ? `카카오 메뉴 ${s.menu_count}건 등록 (${s.menu_price_min?.toLocaleString()}~${s.menu_price_max?.toLocaleString()}원) 평균 × 0.5 보정`
        : "메뉴 미등록 → 시군구 평균 25만 fallback",
      range: "메뉴 정확도 약 11.3%",
    },
    {
      label: "월매출",
      value: fmtMan(e.monthly_revenue.mid),
      basis: "활성회원수 × 평균회비",
      range: `${fmtMan(e.monthly_revenue.low)} ~ ${fmtMan(e.monthly_revenue.high)}`,
    },
    {
      label: "월 임대료",
      value: fmtMan(e.monthly_rent.mid),
      basis: "면적(추정) × 시군구 평당 월세 (강남 14만/평, 외곽 5만/평 베이스)",
      range: `${fmtMan(e.monthly_rent.low)} ~ ${fmtMan(e.monthly_rent.high)}`,
    },
    {
      label: "월 영업이익(순익)",
      value: fmtMan(e.monthly_profit.mid),
      basis: "매출 − (임대료 + 관리비 30 + 인건비 + 운영비 매출×10%)",
      range: `${fmtMan(e.monthly_profit.low)} ~ ${fmtMan(e.monthly_profit.high)}`,
    },
    {
      label: "권리금 멀티플",
      value: `${e.multiple_used}배`,
      basis: `base 6 ± 시군구 가중 × 4 ± 디지털 보너스 × 4 ± 잔여계약. 강남 A급 8~12배, 외곽 D급 3~5배`,
      range: "범위 2.5 ~ 13",
    },
    {
      label: "권리금",
      value: fmtMan(e.key_money.mid),
      basis: "월순익 × 멀티플",
      range: `${fmtMan(e.key_money.low)} ~ ${fmtMan(e.key_money.high)}`,
    },
    {
      label: "총 인수가",
      value: fmtMan(e.total_acquisition.mid),
      basis: "권리금 + 보증금(월세×12) + 준비비(권리금×15%)",
      range: `${fmtMan(e.total_acquisition.low)} ~ ${fmtMan(e.total_acquisition.high)}`,
    },
  ];

  return (
    <details className="mt-4 rounded-xl border border-blue-200 bg-blue-50/40 p-4 text-xs text-blue-900" open={false}>
      <summary className="cursor-pointer text-sm font-semibold flex items-center gap-2">
        <ConfidencePill level={e.confidence} />
        권리금 산정 근거 자세히 보기 (펼치기)
      </summary>
      <p className="mt-3 leading-relaxed text-blue-900/85">
        모든 숫자는 카카오·네이버 공개 데이터 기반의 <strong>{confidenceLabel(e.confidence)}</strong> (신뢰도 {Math.round(e.confidence_score * 100)}%).
        매도자가 등록·실사 후 검증된 값으로 교체됩니다.
      </p>
      <table className="mt-3 w-full text-[11px]">
        <thead className="bg-blue-100/50">
          <tr>
            <th className="text-left px-2 py-1.5 font-medium">항목</th>
            <th className="text-right px-2 py-1.5 font-medium">추정값</th>
            <th className="text-left px-2 py-1.5 font-medium">근거</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {rows.map((r) => (
            <tr key={r.label}>
              <td className="px-2 py-1.5 font-medium">{r.label}</td>
              <td className="px-2 py-1.5 text-right font-bold">{r.value}</td>
              <td className="px-2 py-1.5 text-blue-900/75">{r.basis}<div className="text-[10px] text-blue-700/60 mt-0.5">{r.range}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
