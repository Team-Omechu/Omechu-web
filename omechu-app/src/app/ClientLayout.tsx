"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./components/common/Bottom";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noBottomNavRoutes = [
    "/mypage/user-info-setup",
    "/mypage/user-info-setup/gender",
    "/mypage/profile-edit",
    "/mypage/user-info-edit",
    "/mypage/user-info-setup/state",
    "/mypage/user-info-setup/food",
  ];
  const showBottomNav = !noBottomNavRoutes.includes(pathname);

  return (
    <>
      <main
        className={`${showBottomNav ? "pb-20" : ""} flex-1 bg-[#F8D5FF] overflow-y-scroll`}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </>
  );
}
