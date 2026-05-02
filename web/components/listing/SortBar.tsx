import Link from "next/link";

const GROUPS: { label: string; options: { value: string; label: string }[] }[] = [
  {
    label: "매물 가치",
    options: [
      { value: "yield_desc", label: "수익률 높은순" },
      { value: "payback_asc", label: "회수기간 짧은순" },
      { value: "key_asc", label: "권리금 낮은순" },
      { value: "key_desc", label: "권리금 높은순" },
      { value: "rev_desc", label: "매출 많은순" },
      { value: "total_asc", label: "인수가 낮은순" },
    ],
  },
  {
    label: "SNS 운영",
    options: [
      { value: "score", label: "디지털 점수 높은순" },
    ],
  },
  {
    label: "최신 · 인기",
    options: [
      { value: "newest", label: "최신 등록" },
      { value: "fav", label: "찜 많은순" },
      { value: "views", label: "조회 많은순" },
      { value: "ad", label: "추천순" },
    ],
  },
];

export function SortBar({ current, search }: { current: string; search: Record<string, string> }) {
  const buildHref = (sort: string) => {
    const sp = new URLSearchParams(search);
    sp.set("sort", sort);
    return `/listings?${sp.toString()}`;
  };
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-black/10 bg-white p-2">
      {GROUPS.map((g, gi) => (
        <div key={g.label} className={`flex items-center gap-1 ${gi > 0 ? "border-l border-black/10 pl-4" : ""}`}>
          <span className="text-[10px] font-bold uppercase text-black/40 mr-1">{g.label}</span>
          {g.options.map((o) => (
            <Link key={o.value} href={buildHref(o.value)}
              className={`rounded px-2.5 py-1 text-xs font-medium ${current === o.value ? "bg-black text-white" : "text-black/75 hover:bg-black/5"}`}>
              {o.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
