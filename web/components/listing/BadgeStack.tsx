import { ListingBadge } from "@/lib/types";

const STYLES: Record<ListingBadge, { bg: string; fg: string; label: string }> = {
  urgent:       { bg: "bg-red-100",    fg: "text-red-800",    label: "긴급매각" },
  price_cut:    { bg: "bg-blue-100",   fg: "text-blue-800",   label: "가격인하" },
  new:          { bg: "bg-blue-100",     fg: "text-sky-800",     label: "신규" },
  verified:     { bg: "bg-blue-100", fg: "text-blue-800", label: "검증 매물" },
  owner_direct: { bg: "bg-violet-100",  fg: "text-violet-800",  label: "직거래" },
  agent:        { bg: "bg-black/5",    fg: "text-black/75",    label: "중개" },
  premium:      { bg: "bg-yellow-100",  fg: "text-yellow-800",  label: "최상단" },
};

export function BadgeStack({ badges }: { badges: ListingBadge[] }) {
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => {
        const s = STYLES[b];
        return (
          <span key={b} className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ${s.bg} ${s.fg}`}>
            {s.label}
          </span>
        );
      })}
    </div>
  );
}
