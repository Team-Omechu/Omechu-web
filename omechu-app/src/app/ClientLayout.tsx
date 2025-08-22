"use client";

import { usePathname, useRouter } from "next/navigation";
import BottomNav from "./components/common/Bottom";
import { useEffect } from "react";
import { useUserQuery } from "@/lib/hooks/useAuth";
import { useAuthStore } from "@/lib/stores/auth.store";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionUser, isSuccess, isError } = useUserQuery();
  const { isLoggedIn } = useAuthStore();

  const inAuthSection =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  useEffect(() => {
    const from401 =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("from") === "401";

    // 이미 로그인 상태거나 세션 조회 에러면 아무것도 하지 않음
    if (isLoggedIn || isError) return;

    // 세션 복구 성공 시에만 상태 동기화
    if (isSuccess && sessionUser) {
      // 토큰은 콜백에서 설정되므로 여기서는 사용자 정보만 동기화가 필요할 수 있음
      useAuthStore.getState().setUser(sessionUser);
      console.log("Session restored via Kakao login:", sessionUser);

      // 401로 들어온 경우 또는 인증 섹션에서는 절대 자동 리다이렉트하지 않음
      if (from401 || inAuthSection) return;

      // 온보딩 미완료 사용자는 온보딩으로만 유도 (그 외 페이지는 유지)
      if (!sessionUser.nickname) {
        router.push("/onboarding/1");
      }
      // 닉네임이 있는 정상 사용자라면 현재 페이지 유지 (불필요한 /mainpage 강제 이동 금지)
    }
  }, [
    isSuccess,
    isError,
    sessionUser,
    isLoggedIn,
    router,
    pathname,
    inAuthSection,
  ]);

  const noBottomNavRoutes = [
    // 메인페이지
    "/mainpage/meal-answer",
    "/mainpage/location-answer",
    "/mainpage/result",
    "/mainpage/random-recommend",

    // 로그인, 회원가입, 온보딩 페이지
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/forgot-password/sent",
    "/auth/reset-password",
    "/auth/callback",

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
    "/mypage/user-info-edit/exercise",
    "/mypage/user-info-edit/prefer",
    "/mypage/user-info-edit/body_type",
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

  // ... existing code ...
  return (
    <>
      <main
        className={`${showBottomNav ? "pb-20" : ""} flex-1 overflow-y-scroll bg-main-normal scrollbar-hide`}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </>
  );
}
