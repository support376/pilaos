import Link from "next/link";

const OPTS = [
  { value: "ad", label: "추천" },
  { value: "yield_desc", label: "수익률 ↑" },
  { value: "payback_asc", label: "회수기간 ↓" },
  { value: "key_asc", label: "권리금 ↓" },
  { value: "rev_desc", label: "매출 ↑" },
  { value: "score", label: "디지털 점수 ↑" },
  { value: "newest", label: "최신" },
];

export function SortBar({ current, search }: { current: string; search: Record<string, string> }) {
  const buildHref = (sort: string) => {
    const sp = new URLSearchParams(search);
    sp.set("sort", sort);
    return `/listings?${sp.toString()}`;
  };
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1 pb-1">
      <span className="flex-shrink-0 text-[10px] font-bold uppercase text-black/40 pr-1">정렬</span>
      {OPTS.map((o) => (
        <Link key={o.value} href={buildHref(o.value)}
          className={`flex-shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium whitespace-nowrap ${
            current === o.value ? "bg-black text-white" : "border border-black/15 bg-white text-black/75 hover:bg-black/5"
          }`}>
          {o.label}
        </Link>
      ))}
    </div>
  );
}
