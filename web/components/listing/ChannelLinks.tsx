import { Studio } from "@/lib/types";
import { channelsOf } from "@/lib/listings";
import { BrandIcon } from "./BrandIcon";

const COLORS: Record<string, string> = {
  kakao_place: "bg-blue-50 hover:bg-yellow-100 text-yellow-900 ring-yellow-200",
  naver_place: "bg-blue-50 hover:bg-blue-100 text-blue-900 ring-blue-200",
  homepage: "bg-sky-50 hover:bg-blue-100 text-sky-900 ring-sky-200",
  instagram: "bg-pink-50 hover:bg-pink-100 text-pink-900 ring-pink-200",
  naver_blog: "bg-lime-50 hover:bg-lime-100 text-lime-900 ring-lime-200",
  kakao_channel: "bg-orange-50 hover:bg-red-100 text-orange-900 ring-orange-200",
};

export function ChannelLinks({ studio, compact = false }: { studio: Studio; compact?: boolean }) {
  const links = channelsOf(studio);
  if (links.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-black/15 bg-black/[.03] p-3 text-xs text-black/55">
        외부 채널 정보가 아직 수집되지 않았습니다.
      </div>
    );
  }
  return (
    <div className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}>
      {links.map((l) => (
        <a key={l.kind} href={l.url} target="_blank" rel="noreferrer noopener"
          className={`inline-flex items-center gap-2 rounded-lg ring-1 transition ${COLORS[l.kind] ?? "bg-black/[.03] text-black/75 ring-black/10"} ${compact ? "px-2.5 py-1.5 text-[11px]" : "px-3.5 py-2.5 text-sm"} font-medium`}>
          <BrandIcon kind={l.kind} size={compact ? 16 : 22} />
          <span>{l.label}</span>
          <span aria-hidden className="text-[10px] opacity-60">↗</span>
        </a>
      ))}
    </div>
  );
}

// 카드 미니 칩 (아이콘만)
export function ChannelDots({ studio }: { studio: Studio }) {
  const links = channelsOf(studio);
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {links.slice(0, 6).map((l) => (
        <span key={l.kind} className="inline-flex" title={l.label}>
          <BrandIcon kind={l.kind} size={18} />
        </span>
      ))}
    </div>
  );
}
