import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import BottomNav from "./components/common/Bottom";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Omech - 오늘 뭐 먹지?",
  description: "오늘 뭐 먹지? Omechu가 추천해드려요!",
  icons: {
    icon: "/logo_3d.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex justify-center bg-[#f8f9fa] min-h-screen overflow-x-hidden">
        <div className="relative w-full min-h-screen pb-20 bg-[#f8d6ff] max-w-screen-mobile">
          {/* (이삭) bottomNav의 h에 맞게 본문 pb 설정 */}
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
