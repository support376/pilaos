import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { FavCounterModal } from "@/components/listing/FavCounterModal";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pilaos.vercel.app"),
  title: { default: "pilaos · 필라테스·요가 인수 도와드립니다", template: "%s · pilaos" },
  description: "혼자 인수하면 위험합니다. 우리는 단계로 끊어 도와드립니다 — 매물 발견 → 가격 산정 → 검증 → 변호사 마무리 → 1년 점검.",
  openGraph: { type: "website", siteName: "pilaos", locale: "ko_KR" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

function Nav() {
  return (
    <header className="border-b border-black/10 bg-white sticky top-0 z-30">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3.5">
        <Link href="/" className="text-black"><Logo size={20} /></Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/listings" className="text-black/70 hover:text-black">스페이스</Link>
          <Link href="/diagnostic/" className="hidden text-black/70 hover:text-black sm:inline">진단</Link>
          <Link href="/sell/new" className="text-black/70 hover:text-black">등록</Link>
          <Link href="/inquire?kind=acquire" className="rounded-md bg-black px-3.5 py-1.5 text-xs font-bold text-white hover:bg-black/85">상담 신청</Link>
        </nav>
      </div>
    </header>
  );
}

function Foot() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-3xl px-5 py-8">
        <div className="rounded-lg bg-black/5 px-4 py-3 text-xs text-black/60 leading-relaxed">
          <strong className="text-black">안내.</strong> 본 사이트의 매물은 카카오·네이버 공개 데이터를 기반으로 자동 수집된 잠재 매물입니다. 매장 운영자가 직접 등록한 것이 아니며 권리금·매출 등 모든 숫자는 추정값입니다.
          매장 운영자께서 노출 거부를 원하시면 매물 페이지의 <strong>노출 거부 신청</strong> 또는 운영팀 카톡으로 연락 주세요. 24시간 안에 처리합니다.
        </div>
        <div className="mt-4 flex flex-col gap-2 text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 pilaos · 필라테스 매장 OS</div>
          <div className="flex flex-wrap gap-3">
            <Link href="/sell" className="hover:text-black">매각</Link>
            <Link href="/diagnostic/" className="hover:text-black">진단</Link>
            <Link href="/risk" className="hover:text-black">위험 7가지</Link>
            <Link href="/terms" className="hover:text-black">이용약관</Link>
            <Link href="/privacy" className="hover:text-black">개인정보</Link>
            <Link href="/admin/inbox" className="text-black/30">운영팀</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-black">
        <Nav />
        <main className="flex-1">{children}</main>
        <Foot />
        <FavCounterModal />
      </body>
    </html>
  );
}
