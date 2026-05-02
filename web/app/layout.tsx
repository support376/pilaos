import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pilaos.vercel.app"),
  title: { default: "Pilaos · 필라테스 매물 마켓플레이스", template: "%s · Pilaos" },
  description: "전국 1만개 필라테스 업장의 매물·시세·실사·거래 — 사고 팔고 닫는 모든 것.",
  openGraph: { type: "website", siteName: "Pilaos", locale: "ko_KR" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

function Nav() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-tight">pilaos</span>
          <span className="hidden text-[11px] text-gray-500 sm:inline">필라테스 매물 마켓플레이스</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/listings" className="text-gray-700 hover:text-gray-900">매물</Link>
          <Link href="/me/watchlist" className="text-gray-700 hover:text-gray-900">관심</Link>
          <Link href="/closed" className="hidden text-gray-700 hover:text-gray-900 sm:inline">실거래가</Link>
          <Link href="/calc" className="hidden text-gray-700 hover:text-gray-900 sm:inline">계산기</Link>
          <Link href="/sell/new" className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-50">매물 등록</Link>
          <Link href="/buy/intent" className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-700">매수 등록</Link>
        </nav>
      </div>
    </header>
  );
}

function Foot() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900 leading-relaxed">
          <strong>잠재매물 안내.</strong> 본 사이트의 매물은 카카오·네이버 공개 데이터를 기반으로 자동 수집된 잠재매물입니다. 매장 운영자가 직접 등록한 매물이 아니며 권리금·매출 등 모든 숫자는 추정치입니다.
          <span className="font-semibold"> 매장 운영자께서 노출을 거부하시려면 매물 페이지의 "노출 거부 신청" 또는 운영팀 카톡 채널로 연락 주세요. 24시간 내 처리합니다.</span>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 pilaos · 필라테스 영업양수도 마켓플레이스</div>
          <div className="flex flex-wrap gap-3">
            <Link href="/terms" className="hover:text-gray-900">이용약관</Link>
            <Link href="/privacy" className="hover:text-gray-900 font-semibold">개인정보처리방침</Link>
            <Link href="/start/intent">창업 의향</Link>
            <Link href="/close/intent">폐업 의향</Link>
            <Link href="/admin/inbox">운영팀 인박스</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Nav />
        <main className="flex-1">{children}</main>
        <Foot />
      </body>
    </html>
  );
}
