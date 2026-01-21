"use client";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";

import { kakaoLogin } from "@/entities/user/api/authApi";
import { handleOAuthCallback } from "@/entities/user/lib/utils/oauthCallbackHandler";
import { useToast } from "@/shared";

declare global {
  interface Window {
    Kakao: any;
  }
}

/**
 * Kakao SDK 기반 로그인 훅
 * - initiateKakaoLogin: 카카오 로그인 팝업/리다이렉트 시작
 * - handleKakaoCallback: 콜백 페이지에서 code 처리
 */
export const useKakaoLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { triggerToast } = useToast();

  /**
   * Kakao 로그인 팝업/리다이렉트 시작
   */
  const initiateKakaoLogin = useCallback(() => {
    try {
      if (typeof window === "undefined" || !window.Kakao) {
        triggerToast("카카오 SDK가 로드되지 않았습니다.");
        return;
      }

      const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
      if (!redirectUri) {
        triggerToast("카카오 리다이렉트 URI가 설정되지 않았습니다.");
        return;
      }

      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID);
      }

      // Kakao.Auth.authorize()를 호출하여 리다이렉트 방식 로그인
      window.Kakao.Auth.authorize({
        redirectUri,
        scope: "profile_nickname,account_email,gender",
      });
    } catch (error) {
      console.error("[Kakao Login] Error:", error);
      triggerToast("카카오 로그인 중 오류가 발생했습니다.");
    }
  }, [triggerToast]);

  /**
   * 콜백 페이지에서 호출: authorization code를 받아서 토큰 교환
   * @param code Kakao authorization code
   */
  const handleKakaoCallback = useCallback(
    async (code: string) => {
      setIsLoading(true);
      try {
        // 1. code를 백엔드로 전송하여 토큰 획득
        const tokens = await kakaoLogin(code);

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
        console.error("[Kakao Callback] Error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "로그인에 실패했습니다. 다시 시도해주세요.";
        triggerToast(errorMessage);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    },
    [router, triggerToast]
  );

  return {
    initiateKakaoLogin,
    handleKakaoCallback,
    isLoading,
  };
};
