// 사진 URL 수집 — 4중 fallback으로 100% 매물 사진 보장.
// 1) 카카오 매장 사진 (og:image 또는 panel3)
// 2) 카카오 staticmap (좌표 기반 지도 — 100%)
// 3) 네이버 og:image
// 4) SVG placeholder (시군구 컬러)

const REVALIDATE_S = 60 * 60 * 24 * 7;

export type PhotoSource = "kakao_photo" | "kakao_map" | "naver" | "placeholder";
export type PhotoItem = { url: string; source: PhotoSource; thumb?: string };

/** 카카오맵 매물 페이지 og:image — 매장 사진 우선, fallback으로 staticmap도 받음 */
export async function getKakaoOgImage(kakaoPlaceId: string): Promise<PhotoItem | null> {
  if (!kakaoPlaceId) return null;
  const url = `https://place.map.kakao.com/${encodeURIComponent(kakaoPlaceId)}`;
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; pilaos/1.0; +https://pilaos.vercel.app)",
        "Accept": "text/html,application/xhtml+xml",
      },
      next: { revalidate: REVALIDATE_S, tags: [`kakao-og:${kakaoPlaceId}`] },
    });
    if (!r.ok) return null;
    const html = await r.text();
    const m = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);
    if (!m) return null;
    let raw = m[1];
    if (raw.startsWith("//")) raw = "https:" + raw;
    // staticmap fallback도 사용 — 외형이 깔끔 (지도 + 마커)
    if (raw.includes("staticmap.kakao.com")) {
      // http → https 강제
      raw = raw.replace(/^http:/, "https:");
      return { url: raw, source: "kakao_map" };
    }
    // 매장 사진 (cthumb URL)에서 원본 추출
    const fname = raw.match(/[?&]fname=([^&]+)/);
    let original: string | null = null;
    if (fname) {
      try {
        const decoded = decodeURIComponent(fname[1]);
        if (decoded.startsWith("http")) original = decoded.replace(/^http:/, "https:");
      } catch {}
    }
    return { url: original ?? raw, thumb: raw, source: "kakao_photo" };
  } catch {
    return null;
  }
}

/** 카카오 staticmap — 좌표만으로 즉시 생성. 모든 매물 보장. */
export function getKakaoStaticMap(lng: number, lat: number, size: "card" | "hero" = "card"): PhotoItem {
  const wh = size === "hero" ? "800x400" : "400x200";
  const url = `https://staticmap.kakao.com/staticmap/og?type=place&srs=wgs84&size=${wh}&service=placeweb&m=${lng}%2C${lat}`;
  return { url, source: "kakao_map" };
}

/** 네이버 플레이스 og:image (5,864건만) */
export async function getNaverOgImage(naverUrl: string | null): Promise<PhotoItem | null> {
  if (!naverUrl) return null;
  try {
    const r = await fetch(naverUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; pilaos/1.0)", "Accept": "text/html" },
      next: { revalidate: REVALIDATE_S, tags: [`naver-og:${naverUrl}`] },
    });
    if (!r.ok) return null;
    const html = await r.text();
    const m = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);
    if (!m) return null;
    let raw = m[1];
    if (raw.startsWith("//")) raw = "https:" + raw;
    return { url: raw, source: "naver" };
  } catch {
    return null;
  }
}

/** 4중 fallback — og:image (사진) → og:image (지도) → staticmap → null */
export async function getMainPhoto(kakaoPlaceId: string, lng: number, lat: number, naverUrl: string | null, size: "card" | "hero" = "card"): Promise<PhotoItem> {
  // 1) og:image (lazy fetch — 매장 사진 우선)
  const og = await getKakaoOgImage(kakaoPlaceId);
  if (og && og.source === "kakao_photo") return og;
  // 2) staticmap (좌표 기반 — 즉시 보장)
  if (lng && lat) return getKakaoStaticMap(lng, lat, size);
  // 3) 네이버 og:image
  if (naverUrl) {
    const n = await getNaverOgImage(naverUrl);
    if (n) return n;
  }
  // 4) og 결과가 staticmap이라도 사용
  if (og) return og;
  // 5) placeholder URL (사용 측에서 SVG 렌더)
  return { url: "", source: "placeholder" };
}
