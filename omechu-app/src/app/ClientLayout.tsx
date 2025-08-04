"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserQuery } from "@/lib/hooks/useAuth";
import { useAuthStore } from "@/auth/store";
import Toast from "./components/common/Toast";

// 'react' 패키지에서 React 타입을 명시적으로 가져옵니다.
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: sessionUser, isSuccess, isError } = useUserQuery();
  const { user, setUser, login: loginAction, isLoggedIn } = useAuthStore();

  useEffect(() => {
    // 이미 프론트엔드에 로그인 상태이거나, 세션 확인 API가 실패한 경우 아무것도 하지 않음
    if (isLoggedIn || isError) {
      return;
    }

    // 세션 확인에 성공했고, 유저 정보가 있다면
    if (isSuccess && sessionUser) {
      // Zustand 스토어에 유저 정보 저장
      loginAction({
        accessToken: "DUMMY_TOKEN_FOR_KAKAO_LOGIN", // 카카오 로그인은 세션 기반이므로 토큰은 의미 없음
        user: sessionUser,
      });

      console.log("Session restored via Kakao login:", sessionUser);

      // 닉네임이 없다면 온보딩 페이지로 보냄
      if (!sessionUser.nickname) {
        router.push("/onboarding/1");
      } else if (
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up")
      ) {
        // 닉네임이 있고, 현재 페이지가 로그인/회원가입 페이지라면 메인으로 이동
        router.push("/mainpage");
      }
    }
  }, [
    isSuccess,
    isError,
    sessionUser,
    isLoggedIn,
    loginAction,
    router,
    pathname,
  ]);

  return (
    <>
      {children}
      {/* <Toast />  기존에 Toast 컴포넌트가 있다면 그대로 두세요. */}
    </>
  );
}
