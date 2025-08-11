import "./globals.css";

import { Noto_Sans_KR } from "next/font/google";

import type { Metadata } from "next";

import ReactQueryProvider from "./lib/providers/ReactQueryProvider";
import ClientLayout from "./ClientLayout";

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "700"], // 사용할 폰트 굵기
  variable: "--font-noto-sans-kr", // CSS 변수 이름 설정
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Omechu - 오늘 뭐 먹지?",
  description: "오늘 뭐 먹지? Omechu가 추천해드려요!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`relative mx-auto flex min-h-screen min-w-[375px] flex-col overflow-x-hidden ${notoSansKR.variable}`}
      >
        <ReactQueryProvider>
          <ClientLayout>{children}</ClientLayout>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
