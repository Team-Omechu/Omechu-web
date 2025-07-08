import "./globals.css";

import type { Metadata } from "next";

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
      <body className="relative flex flex-col min-h-screen mx-auto overflow-x-hidden max-w-screen-mobile">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
