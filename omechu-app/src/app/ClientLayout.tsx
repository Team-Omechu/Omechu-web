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

    // 마이페이지-이용약관
    "/mypage/terms/service",
    "/mypage/terms/personal-info",
    "/mypage/terms/location-info",
    "/mypage/user-info-setup/1",
    "/mypage/user-info-setup/2",
    "/mypage/user-info-setup/3",
    "/mypage/user-info-setup/4",
    "/mypage/user-info-setup/5",
    "/mypage/user-info-setup/6",

    // 메인페이지-질문답변
    "/mainpage/question-answer/1",
    "/mainpage/question-answer/2",
    "/mainpage/question-answer/3",
    "/mainpage/question-answer/4",
    "/mainpage/question-answer/5",
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
