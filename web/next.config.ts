import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingIncludes: { "/**/*": ["./data/pilates.db"] },
  images: {
    remotePatterns: [
      // 카카오
      { protocol: "https", hostname: "t1.daumcdn.net" },
      { protocol: "https", hostname: "img1.kakaocdn.net" },
      { protocol: "https", hostname: "t1.kakaocdn.net" },
      { protocol: "http",  hostname: "t1.kakaocdn.net" },
      // 네이버
      { protocol: "https", hostname: "phinf.pstatic.net" },
      { protocol: "https", hostname: "ldb-phinf.pstatic.net" },
      { protocol: "https", hostname: "search.pstatic.net" },
      // og:image 다양한 호스트
      { protocol: "https", hostname: "**.kakaocdn.net" },
      { protocol: "https", hostname: "**.pstatic.net" },
    ],
    deviceSizes: [320, 640, 750, 1080],
    imageSizes: [120, 240, 360],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;
