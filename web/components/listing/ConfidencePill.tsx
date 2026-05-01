import { ConfidenceLevel } from "@/lib/types";
import { confidenceColor, confidenceLabel } from "@/lib/estimate";

export function ConfidencePill({ level }: { level: ConfidenceLevel }) {
  return (
    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ${confidenceColor(level)}`}>
      {confidenceLabel(level)}
    </span>
  );
}
