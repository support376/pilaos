// 사진 URL 수집 — 카카오맵 og:image 우선.
// 풀 갤러리는 사용자 로컬 운영 DB의 panel3 raw_json에서 별도 추출 (scripts/extract_photos_from_raw.py).
//
// 모든 fetch는 Next.js fetch cache 활용 (revalidate 7일).

const REVALIDATE_S = 60 * 60 * 24 * 7; // 7일

export type PhotoSource = "kakao" | "naver" | "uploaded";
export type PhotoItem = { url: string; source: PhotoSource; thumb?: string };

/** Kakao place 페이지의 og:image. SSR fetch 후 정규식으로 추출. */
export async function getKakaoOgImage(kakaoPlaceId: string): Promise<PhotoItem | null> {
  if (!kakaoPlaceId) return null;
  const url = `https://place.map.kakao.com/${encodeURIComponent(kakaoPlaceId)}`;
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; pilaos/1.0; +https://pilaos.vercel.app)",
        "Accept": "text/html,application/xhtml+xml",
      },
      next: { revalidate: REVALIDATE_S, tags: [`kakao:${kakaoPlaceId}`] },
    });
    if (!r.ok) return null;
    const html = await r.text();
    const m = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);
    if (!m) return null;
    let raw = m[1];
    // protocol-relative → https
    if (raw.startsWith("//")) raw = "https:" + raw;
    // staticmap.kakao.com (지도 미리보기)는 제외 — 매장 사진이 없을 때 카카오가 자동 fallback
    if (raw.includes("staticmap.kakao.com")) return null;
    // cthumb URL에서 원본 fname 추출 (옵션) — 더 큰 이미지 얻기
    const fname = raw.match(/[?&]fname=([^&]+)/);
    let original: string | null = null;
    if (fname) {
      try {
        const decoded = decodeURIComponent(fname[1]);
        if (decoded.startsWith("http")) original = decoded.replace(/^http:/, "https:");
      } catch {}
    }
    return {
      url: original ?? raw,
      thumb: raw,
      source: "kakao",
    };
  } catch {
    return null;
  }
}

/** Naver place 페이지의 og:image (5,864건만 — naver_place_id 매핑된 경우). */
export async function getNaverOgImage(naverUrl: string | null): Promise<PhotoItem | null> {
  if (!naverUrl) return null;
  try {
    const r = await fetch(naverUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; pilaos/1.0)",
        "Accept": "text/html",
      },
      next: { revalidate: REVALIDATE_S, tags: [`naver:${naverUrl}`] },
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

/** 카카오 + 네이버 og:image 병렬 fetch. */
export async function getMainPhoto(kakaoPlaceId: string, naverUrl: string | null): Promise<PhotoItem | null> {
  const [k, n] = await Promise.all([
    getKakaoOgImage(kakaoPlaceId),
    naverUrl ? getNaverOgImage(naverUrl) : Promise.resolve(null),
  ]);
  return k ?? n; // 카카오 우선
}
