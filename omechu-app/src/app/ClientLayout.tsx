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
    // 메인페이지
    "/mainpage/question-answer/meal-time",
    "/mainpage/question-answer/purpose",
    "/mainpage/question-answer/state",
    "/mainpage/question-answer/who",
    "/mainpage/question-answer/budget",
    "/mainpage/question-answer/middle-question",

    // 마이페이지
    "/mypage/user-info-setup",
    "/mypage/user-info-setup/gender",
    "/mypage/profile-edit",
    "/mypage/user-info-edit",
    "/mypage/user-info-setup/state",
    "/mypage/user-info-setup/food",
    "/mypage/user-info-setup/condition",
    "/mypage/user-info-setup/allergy",
    "/mypage/recommended-list",
    "/mainpage/question-answer/meal-time",
    "/mainpage/question-answer/purpose",
    "/mainpage/question-answer/state",
    "/mainpage/question-answer/who",
    "/mainpage/question-answer/budget",
    "/mainpage/question-answer/middle-question",
    "/mainpage/meal-answer",
    "/mainpage/location-answer",
    "/mypage/recommended-list",

    // 마이페이지-이용약관
    "/mypage/terms/service",
    "/mypage/terms/personal-info",
    "/mypage/terms/location-info",
  ];
  const showBottomNav = !noBottomNavRoutes.includes(pathname);

  return (
    <>
      <main
        className={`${showBottomNav ? "pb-20" : ""} flex-1 bg-[#F8D5FF] dark:bg-[#baa0bf] overflow-y-scroll`}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </>
  );
}
