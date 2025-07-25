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
    "/mainpage/meal-answer",
    "/mainpage/location-answer",
    "/mainpage/result",
    "/mainpage/random-recommend",

    // 로그인, 회원가입, 온보딩 페이지
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/forgot-password/sent",
    "/auth/reset-password",

    // 온보딩 페이지
    "/onboarding/1",
    "/onboarding/2",
    "/onboarding/3",
    "/onboarding/4",
    "/onboarding/5",
    "/onboarding/6",

    // 전체메뉴 페이지
    "/fullmenu/menu-detail",
    "/fullmenu/menu-detail/recipe-detail",

    // 맛집-상세페이지
    "/restaurant/restaurant-detail",

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
    "/mypage/settings/terms",
    "/mypage/settings/terms/service",
    "/mypage/settings/terms/personal-info",
    "/mypage/settings/terms/location-info",
    // 마이페이지-먹부림일지
    "/mypage/foodie-log",
    // 마이페이지-찜목록
    "/mypage/favorites",
    // 마이페이지-활동내역
    "/mypage/my-activity",
  ];

  const dynamicNoBottomNavPrefixes = [
    // 동적 라우트가 있는 페이지들
    "/restaurant/restaurant-detail/",
    "/mainpage/question-answer/",
    "/mainpage/result/",
  ];

  const showBottomNav = !(
    noBottomNavRoutes.includes(pathname) ||
    dynamicNoBottomNavPrefixes.some((prefix) => pathname.startsWith(prefix))
  );

  return (
    <>
      <main
        className={`${showBottomNav ? "pb-20" : ""} flex-1 overflow-y-scroll bg-[#F8D5FF] scrollbar-hide`}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </>
  );
}
