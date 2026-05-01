import Link from "next/link";

const OPTIONS: { value: string; label: string }[] = [
  { value: "ad", label: "광고순" },
  { value: "yield_desc", label: "수익률 ↓" },
  { value: "yield_asc", label: "수익률 ↑" },
  { value: "payback_asc", label: "회수기간 ↑" },
  { value: "key_asc", label: "권리금 ↑" },
  { value: "key_desc", label: "권리금 ↓" },
  { value: "rev_desc", label: "월매출 ↓" },
  { value: "total_asc", label: "인수가 ↑" },
  { value: "newest", label: "최신등록" },
  { value: "owner_check", label: "최근확인" },
  { value: "fav", label: "찜수" },
  { value: "views", label: "조회수" },
];

export function SortBar({ current, search }: { current: string; search: Record<string, string> }) {
  const buildHref = (sort: string) => {
    const sp = new URLSearchParams(search);
    sp.set("sort", sort);
    return `/listings?${sp.toString()}`;
  };
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-1.5">
      {OPTIONS.map((o) => (
        <Link
          key={o.value}
          href={buildHref(o.value)}
          className={`rounded px-3 py-1.5 text-xs font-medium ${current === o.value ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}
