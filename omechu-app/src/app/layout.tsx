import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
      <body className="flex flex-col min-h-screen mx-auto overflow-x-hidden max-w-screen-mobile ">
        <main className="flex-1 bg-[#F8D5FF] pb-20 overflow-y-scroll scroll-smooth">
          {children}
        </main>
      </body>
    </html>
  );
}
