"use client";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";
import { useGoogleLogin as useGoogleOAuthLogin } from "@react-oauth/google";

import { googleLogin } from "@/entities/user/api/authApi";
import { handleOAuthCallback } from "@/entities/user/lib/utils/oauthCallbackHandler";
import { useToast } from "@/shared";

/**
 * Google OAuth 기반 로그인 훅
 * - handleGoogleLogin: Google 팝업 로그인 시작
 * - isLoading: 로그인 진행 중 상태
 */
export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
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
          setIsLoading(false);
          return;
        }

        // 1. code를 백엔드로 전송하여 토큰 획득
        const tokens = await googleLogin(code);

        // 2. 공통 OAuth 콜백 핸들러 호출 (프로필 조회, 저장, 리다이렉트)
        await handleOAuthCallback({
          tokens,
          router,
          onError: (error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "로그인에 실패했습니다. 다시 시도해주세요.";
            triggerToast(errorMessage);
          },
        });
      } catch (error) {
        console.error("[Google Login] Error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "로그인에 실패했습니다. 다시 시도해주세요.";
        triggerToast(errorMessage);
        // Google 팝업 실패 시에도 login으로 리다이렉트
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    },
    [router, triggerToast]
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
