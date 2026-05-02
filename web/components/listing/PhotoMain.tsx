import Image from "next/image";
import { getMainPhoto } from "@/lib/photos";

type Props = {
  kakaoPlaceId: string;
  lng: number;
  lat: number;
  naverUrl?: string | null;
  alt: string;
  size?: "card" | "hero";
  sigungu?: string | null;
};

const SIGUNGU_COLORS: Record<string, string> = {
  "강남구": "#fbbf24", "서초구": "#f59e0b", "송파구": "#fb923c",
  "마포구": "#34d399", "용산구": "#10b981", "성동구": "#06b6d4",
  "광진구": "#0ea5e9", "영등포구": "#3b82f6", "분당구": "#6366f1",
  "수지구": "#8b5cf6", "기흥구": "#a855f7", "성남시": "#d946ef",
};

function colorFor(sigungu?: string | null): string {
  if (!sigungu) return "#94a3b8";
  if (SIGUNGU_COLORS[sigungu]) return SIGUNGU_COLORS[sigungu];
  // 해시 기반 색상 풀
  const palette = ["#f87171", "#fb923c", "#fbbf24", "#a3e635", "#34d399", "#22d3ee", "#60a5fa", "#a78bfa", "#f472b6"];
  let h = 0;
  for (let i = 0; i < sigungu.length; i++) h = (h * 31 + sigungu.charCodeAt(i)) | 0;
  return palette[Math.abs(h) % palette.length];
}

function SVGPlaceholder({ alt, color, size }: { alt: string; color: string; size: "card" | "hero" }) {
  const w = size === "hero" ? 800 : 400;
  const h = size === "hero" ? 400 : 200;
  const initial = alt.replace(/[^가-힣a-zA-Z0-9]/g, "").slice(0, 2);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width={w} height={h} fill={color} opacity="0.15" />
      <rect width={w} height={h} fill={color} opacity="0.05" />
      <text x={w/2} y={h/2 + 12} fontSize={size === "hero" ? 64 : 32} fontWeight="700" fill={color} textAnchor="middle" fontFamily="sans-serif">{initial}</text>
    </svg>
  );
}

export async function PhotoMain({ kakaoPlaceId, lng, lat, naverUrl, alt, size = "card", sigungu }: Props) {
  const photo = await getMainPhoto(kakaoPlaceId, lng, lat, naverUrl ?? null, size);
  const dimensions = size === "hero"
    ? { containerClass: "relative h-64 w-full overflow-hidden bg-black/5 sm:h-96", imgSizes: "(min-width: 768px) 1080px, 100vw" }
    : { containerClass: "absolute inset-0", imgSizes: "(min-width: 768px) 480px, 100vw" };

  if (photo.source === "placeholder" || !photo.url) {
    return (
      <div className={dimensions.containerClass} aria-label={alt}>
        <SVGPlaceholder alt={alt} color={colorFor(sigungu)} size={size} />
      </div>
    );
  }

  const sourceLabel = photo.source === "kakao_photo" ? "매장 사진" : photo.source === "kakao_map" ? "위치 지도" : "네이버";

  return (
    <div className={dimensions.containerClass}>
      <Image
        src={photo.url}
        alt={alt}
        fill
        sizes={dimensions.imgSizes}
        className="object-cover"
        unoptimized={photo.source === "kakao_map"}
      />
      <div className="absolute bottom-1 right-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-medium text-white">{sourceLabel}</div>
    </div>
  );
}
