import { Listing } from "@/lib/types";

export function PotentialBadge({ listing, size = "sm" }: { listing: Listing; size?: "sm" | "md" }) {
  const status = listing.status;
  const baseClass = size === "md" ? "text-xs px-2 py-1" : "text-[10px] px-1.5 py-0.5";

  if (status === "claimed" || (status as string) === "verified" || (status as string) === "engaged") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-md ${baseClass} font-medium bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200`}>
        <span aria-hidden>✓</span>
        주인 인증
      </span>
    );
  }

  // potential / cold
  return (
    <span className={`inline-flex items-center gap-1 rounded-md ${baseClass} font-medium bg-amber-50 text-amber-800 ring-1 ring-amber-200`}>
      <span aria-hidden>◇</span>
      잠재매물 · 주인 미등록
    </span>
  );
}
