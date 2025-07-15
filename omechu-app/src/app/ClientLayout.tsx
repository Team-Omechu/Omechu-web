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
    "/mainpage/meal-answer",
    "/mainpage/location-answer",
    "/mainpage/result",
    "mainpage/question-answer/",

    "/mainpage/question-answer/meal-time",
    "/mainpage/question-answer/purpose",
    "/mainpage/question-answer/state",
    "/mainpage/question-answer/who",
    "/mainpage/question-answer/budget",
    "/mainpage/question-answer/middle-question",
    "/mainpage/meal-answer",
    "/mainpage/location-answer",
    "/mypage/recommended-list",

    // 로그인, 회원가입, 온보딩 페이지
    "/auth/login",
    "/auth/signup",
    "/auth/find-password",
    "/auth/find-password/sent",
    "/auth/reset-password",
    "/onboarding/1",
    "/onboarding/2",
    "/onboarding/3",
    "/onboarding/4",
    "/onboarding/5",
    "/onboarding/6",

    //맛집-상세페이지
    "restaurant/restaurant-detail",
    "restaurant/restaurant-detail/[id]/map",

    // 마이페이지
    "/mypage/user-info-setup",
    "/mypage/user-info-setup/gender",
    "/mypage/profile-edit",
    "/mypage/user-info-edit",
    "/mypage/user-info-edit/start",
    "/mypage/user-info-edit/gender",
    "/mypage/user-info-edit/state",
    "/mypage/user-info-edit/food",
    "/mypage/user-info-edit/condition",
    "/mypage/user-info-edit/allergy",
    // 추천맛집목록
    "/mypage/recommended-list",
    // 마이페이지-설정
    "/mypage/settings",
    "/mypage/settings/account-settings",
    "/mypage/settings/account-settings/change-password",
    // 마이페이지-이용약관
    "/mypage/terms",
    "/mypage/terms/service",
    "/mypage/terms/personal-info",
    "/mypage/terms/location-info",
  ];
  const showBottomNav = !(
    noBottomNavRoutes.includes(pathname) ||
    pathname.startsWith("/mainpage/result/") ||
    pathname.startsWith("/mainpage/question-answer/")
  );

  return (
    <>
      <main
        className={`${showBottomNav ? "pb-20" : ""} flex-1 overflow-y-scroll bg-[#F8D5FF] dark:bg-[#baa0bf]`}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </>
  );
}
