import Link from "next/link";
import { WatchlistClient } from "./client";

export default function Watchlist() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <h1 className="text-2xl font-bold">관심 매물</h1>
        <span className="rounded-md bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-800">로그인 후 안전 보관</span>
      </div>
      <p className="mt-1 text-sm text-gray-600">♥ 표시한 매물 모아보기. 현재 브라우저에 임시 저장 중 — 곧 출시될 로그인 후엔 계정에 안전 보관됩니다.</p>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
        <strong>로그인 안내 (준비 중).</strong>
        지금은 브라우저 쿠키에 임시 저장됩니다. 다른 기기에서는 안 보이고, 쿠키 삭제 시 사라집니다.
        곧 출시될 휴대폰 인증 로그인 후엔 모든 기기에서 동기화 + 매도자 측 컨택 진행 상태도 확인 가능합니다.
      </div>

      <WatchlistClient />
    </div>
  );
}

export const metadata = { title: "관심 매물", robots: { index: false } };
