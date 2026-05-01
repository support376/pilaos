import { Studio } from "@/lib/types";
import { channelsOf } from "@/lib/listings";

const ICONS: Record<string, string> = {
  kakao_place: "🗺",
  naver_place: "N",
  homepage: "🌐",
  instagram: "@",
  naver_blog: "B",
  kakao_channel: "💬",
};

const COLORS: Record<string, string> = {
  kakao_place: "bg-yellow-50 text-yellow-900 ring-yellow-200 hover:bg-yellow-100",
  naver_place: "bg-emerald-50 text-emerald-900 ring-emerald-200 hover:bg-emerald-100",
  homepage: "bg-sky-50 text-sky-900 ring-sky-200 hover:bg-sky-100",
  instagram: "bg-pink-50 text-pink-900 ring-pink-200 hover:bg-pink-100",
  naver_blog: "bg-lime-50 text-lime-900 ring-lime-200 hover:bg-lime-100",
  kakao_channel: "bg-orange-50 text-orange-900 ring-orange-200 hover:bg-orange-100",
};

export function ChannelLinks({ studio, compact = false }: { studio: Studio; compact?: boolean }) {
  const links = channelsOf(studio);
  if (links.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-500">
        외부 채널 정보가 아직 수집되지 않았습니다.
      </div>
    );
  }
  return (
    <div className={`flex flex-wrap ${compact ? "gap-1" : "gap-2"}`}>
      {links.map((l) => (
        <a
          key={l.kind}
          href={l.url}
          target="_blank"
          rel="noreferrer noopener"
          className={`inline-flex items-center gap-1.5 rounded-md ring-1 transition ${COLORS[l.kind] ?? "bg-gray-50 text-gray-700 ring-gray-200"} ${compact ? "px-2 py-1 text-[11px]" : "px-3 py-2 text-xs"} font-medium`}
        >
          <span className="font-bold" aria-hidden>{ICONS[l.kind] ?? "·"}</span>
          {l.label}
          <span aria-hidden className="text-[10px] opacity-60">↗</span>
        </a>
      ))}
    </div>
  );
}
