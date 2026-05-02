import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FavCounterModal } from "@/components/listing/FavCounterModal";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pilaos.vercel.app"),
  title: { default: "Pilaos · 필라테스 매물 마켓플레이스", template: "%s · Pilaos" },
  description: "전국 필라테스 매장 정보 · SNS 운영현황 · 추정매출 · 매수/매도 의향 매칭 + 변호사 동반 실사.",
  openGraph: { type: "website", siteName: "Pilaos", locale: "ko_KR" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

function Nav() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="text-lg font-extrabold tracking-tight">pilaos</span>
          <span className="hidden text-[11px] text-gray-500 sm:inline">필라테스 매물</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-3">
          <Link href="/listings" className="text-gray-700 hover:text-gray-900">매물</Link>
          <Link href="/process" className="hidden text-gray-700 hover:text-gray-900 sm:inline">절차</Link>
          <Link href="/pricing" className="text-gray-700 hover:text-gray-900">가격</Link>
          <Link href="/inquire?kind=acquire" className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-700">무료 상담</Link>
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
        <div className="mt-3 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-[11px] text-gray-600 leading-relaxed">
          <strong className="text-gray-800">면책 및 책임의 한계.</strong>
          본 사이트가 제공하는 권리금·매출·수익률·매도 시그널 등 모든 숫자와 평가는 공개 데이터 기반의 <strong>추정·참고용</strong>이며 실제 거래 가격·실거래 매출과 다를 수 있습니다.
          매물 정보의 정확성·최신성·완전성에 대해 보증하지 않으며, 본 정보를 근거로 한 거래·투자 결정의 책임은 전적으로 이용자에게 있습니다.
          pilaos는 거래 당사자 간 분쟁의 직접 당사자가 아니며, 손해가 발생하더라도 정보 제공 범위 내에서 책임이 제한됩니다 (이용약관 제8조).
          영업양수도는 분쟁 빈도가 높은 거래이므로 변호사 동반 실사를 권장합니다.
        </div>
        <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 pilaos · 필라테스 영업양수도 마켓플레이스</div>
          <div className="flex flex-wrap gap-3">
            <Link href="/process" className="hover:text-gray-900">5단계 절차</Link>
            <Link href="/pricing" className="hover:text-gray-900">가격</Link>
            <Link href="/risk" className="hover:text-gray-900">7가지 위험</Link>
            <Link href="/terms" className="hover:text-gray-900">이용약관</Link>
            <Link href="/privacy" className="hover:text-gray-900">개인정보</Link>
            <Link href="/admin/inbox" className="text-gray-400">운영팀</Link>
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
        <FavCounterModal />
      </body>
    </html>
  );
}
