import { WatchlistClient } from "./client";

export default function Watchlist() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">관심 매물</h1>
      <p className="mt-1 text-sm text-gray-600">♥ 표시한 매물을 한곳에서 모아봅니다. 브라우저에 저장되며 매수 의향 등록하시면 운영팀이 매도 측 컨택을 진행합니다.</p>
      <WatchlistClient />
    </div>
  );
}

export const metadata = { title: "관심 매물", robots: { index: false } };
