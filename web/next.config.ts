import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3는 네이티브 모듈이라 번들 대상에서 제외
  serverExternalPackages: ["better-sqlite3"],

  // SQLite 파일을 서버리스 함수 번들에 포함 (Vercel 배포 필수)
  outputFileTracingIncludes: {
    "/**/*": ["./data/pilates.db"],
  },
};

export default nextConfig;
