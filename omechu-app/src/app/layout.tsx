import "./globals.css";

import { Noto_Sans_KR } from "next/font/google";

import type { Metadata } from "next";

import { Providers } from "@/app/providers";

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "오메추",
  description: "오늘 뭐 먹지? Omechu가 추천해드려요!",
  icons: {
    icon: [
      { url: "/logo/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/logo/logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`bg-gray-200 ${notoSansKR.variable}`}>
        {/* 모바일 앱 컨테이너 - max-width 제한, 중앙 정렬 */}
        <div className="bg-background-primary relative mx-auto flex min-h-screen w-full max-w-107.5 min-w-93.75 flex-col overflow-x-hidden shadow-xl">
          <Providers>
            <main className="bg-background-primary scrollbar-hide relative flex flex-1 flex-col overflow-y-scroll">
              {children}
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
