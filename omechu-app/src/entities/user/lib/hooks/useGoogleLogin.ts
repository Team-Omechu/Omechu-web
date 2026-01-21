"use client";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";
import { useGoogleLogin as useGoogleOAuthLogin } from "@react-oauth/google";

import { googleLogin, getCurrentUserWithToken } from "@/entities/user/api/authApi";
import { useAuthStore } from "@/entities/user/model/auth.store";
import { useToast } from "@/shared";

/**
 * Google OAuth 기반 로그인 훅
 * - handleGoogleLogin: Google 팝업 로그인 시작
 * - isLoading: 로그인 진행 중 상태
 */
export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login: setLoginState } = useAuthStore();
  const router = useRouter();
  const { triggerToast } = useToast();

  /**
   * Google authorization code 받은 후 처리
   */
  const handleGoogleSuccess = useCallback(
    async (codeResponse: any) => {
      setIsLoading(true);
      try {
        // codeResponse.code에는 authorization code가 포함됨
        const code = codeResponse.code;

        if (!code) {
          triggerToast("인증 코드를 받지 못했습니다.");
          return;
        }

        // 1. code를 백엔드로 전송하여 토큰 획득
        const tokens = await googleLogin(code);

        // 2. 토큰으로 유저 정보 조회
        const user = await getCurrentUserWithToken(tokens.accessToken);

        // 3. Zustand store에 저장
        setLoginState({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
          password: "",
        });

        // 4. 닉네임 여부에 따라 리다이렉트
        if (!user.nickname) {
          router.push("/onboarding/1");
        } else {
          router.push("/mainpage");
        }
      } catch (error) {
        console.error("[Google Login] Error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "로그인에 실패했습니다. 다시 시도해주세요.";
        triggerToast(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [setLoginState, router, triggerToast]
  );

  /**
   * Google 로그인 에러 처리
   */
  const handleGoogleError = useCallback(() => {
    triggerToast("구글 로그인이 취소되었습니다.");
    setIsLoading(false);
  }, [triggerToast]);

  /**
   * @react-oauth/google의 useGoogleLogin 훅 사용
   * flow: "auth-code" - authorization code 방식
   */
  const handleGoogleLogin = useGoogleOAuthLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: "auth-code",
  });

  return {
    handleGoogleLogin,
    isLoading,
  };
};
