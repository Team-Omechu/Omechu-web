import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Omechu - 오늘 뭐 먹지?",
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
      <body className="relative flex flex-col min-h-screen mx-auto overflow-x-hidden max-w-screen-mobile dark:bg-[#1a1a1a] dark:text-white">
        <ThemeProvider attribute="class">
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
