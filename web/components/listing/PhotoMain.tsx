import Image from "next/image";
import { getKakaoOgImage, getNaverOgImage } from "@/lib/photos";

type Props = {
  kakaoPlaceId: string;
  naverUrl?: string | null;
  alt: string;
  size?: "card" | "hero";
};

export async function PhotoMain({ kakaoPlaceId, naverUrl, alt, size = "card" }: Props) {
  // 카카오 우선, 실패 시 네이버
  const k = await getKakaoOgImage(kakaoPlaceId);
  const photo = k ?? (naverUrl ? await getNaverOgImage(naverUrl) : null);

  const dimensions = size === "hero"
    ? { containerClass: "relative h-64 w-full overflow-hidden rounded-xl bg-gray-100 sm:h-80", imgSizes: "(min-width: 768px) 768px, 100vw" }
    : { containerClass: "relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-32", imgSizes: "128px" };

  if (!photo) {
    return (
      <div className={`${dimensions.containerClass} flex items-center justify-center border border-dashed border-gray-300 bg-gray-50`}>
        <div className="px-2 text-center">
          <div className="text-[11px] text-gray-500">사진 미수집</div>
          <div className="mt-1 text-[10px] text-gray-400">외부 채널 확인</div>
        </div>
      </div>
    );
  }

  return (
    <div className={dimensions.containerClass}>
      <Image
        src={photo.url}
        alt={alt}
        fill
        sizes={dimensions.imgSizes}
        className="object-cover"
        unoptimized={false}
      />
      <div className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white">
        {photo.source === "kakao" ? "카카오맵" : "네이버"}
      </div>
    </div>
  );
}
