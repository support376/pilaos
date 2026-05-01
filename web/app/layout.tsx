import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://pilaos.vercel.app"
  ),
  title: {
    default: "Pilaos · 전국 필라테스 디지털 성적표",
    template: "%s · Pilaos",
  },
  description:
    "전국 1만개 필라테스 스튜디오의 네이버·카카오·인스타·블로그·홈페이지 등록 현황과 디지털 준비도 점수.",
  openGraph: {
    type: "website",
    siteName: "Pilaos",
    locale: "ko_KR",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
