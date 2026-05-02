import { Listing } from "@/lib/types";
import { confidenceLabel } from "@/lib/estimate";

export function EstimateNote({ listing, expandable = true }: { listing: Listing; expandable?: boolean }) {
  const e = listing.estimate;
  return (
    <details className="mt-3 rounded-lg border border-blue-200 bg-blue-50/60 p-3 text-xs text-blue-900" open={!expandable}>
      <summary className="cursor-pointer font-semibold">
        ⓘ 권리금·매출·순익은 모두 <strong>{confidenceLabel(e.confidence)}</strong> — 공개 데이터 기반 산식
      </summary>
      <div className="mt-2 space-y-1.5 text-blue-900/90 leading-relaxed">
        <p>이 매물은 <strong>잠재매물</strong>입니다. 주인이 직접 등록한 정보가 아닌 카카오·네이버 공개 데이터로 만든 추정치이며, 실사 후 검증된 값으로 교체됩니다.</p>
        <ul className="ml-4 list-disc space-y-0.5">
          <li>월매출 = 활성회원수(추정) × 평균 회비(메뉴 수집값 또는 시군구 평균)</li>
          <li>월순익 = 매출 − 임대료(평수×시군구 평당월세) − 인건비 − 운영비</li>
          <li>권리금 = 월순익 × 시군구·디지털 멀티플 (2.5~13배)</li>
          <li>총 인수가 = 권리금 + 보증금(월세×12) + 준비비(권리금×15%)</li>
        </ul>
        <p className="text-[11px] mt-2 text-blue-800/80">멀티플 {e.multiple_used}x · 신뢰 {Math.round(e.confidence_score * 100)}%</p>
      </div>
    </details>
  );
}
