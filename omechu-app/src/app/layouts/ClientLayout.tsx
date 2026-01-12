"use client";

import { useEffect, useRef } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useUserQuery } from "@/entities/user/lib/hooks/useAuth";
import { useAuthStore } from "@/entities/user/model/auth.store";
import { setupAxiosInterceptors } from "@/shared/lib/axiosInstance";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionUser, isSuccess, isError } = useUserQuery();
  const { isLoggedIn } = useAuthStore();
  const interceptorsInitialized = useRef(false);

  // Axios interceptors 초기화 (FSD: app에서 shared에 의존성 주입)
  useEffect(() => {
    if (!interceptorsInitialized.current) {
      setupAxiosInterceptors(useAuthStore);
      interceptorsInitialized.current = true;
    }
  }, []);

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

  return (
    <main className="bg-main-normal scrollbar-hide flex-1 overflow-y-scroll">
      {children}
    </main>
  );
}
