/**
 * OAuth 콜백 공통 핸들러
 * - Kakao/Google 모두 동일한 로직 사용
 */

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import {
  getCurrentUserWithToken,
  type LoginTokens,
} from "@/entities/user/api/authApi";
import type { LoginSuccessData } from "@/entities/user/api/authApi";
import { useAuthStore } from "@/entities/user/model/auth.store";

interface OAuthCallbackHandlerOptions {
  tokens: LoginTokens;
  router: AppRouterInstance;
  onError?: (error: Error) => void;
}

/**
 * OAuth 로그인 콜백 공통 처리
 * 1. 토큰 저장
 * 2. 프로필 조회
 * 3. 스토어 업데이트
 * 4. 닉네임 여부에 따라 리다이렉트
 */
export const handleOAuthCallback = async ({
  tokens,
  router,
  onError,
}: OAuthCallbackHandlerOptions): Promise<void> => {
  try {
    // 1. 토큰으로 유저 정보 조회
    const user = await getCurrentUserWithToken(tokens.accessToken);

    // 2. Zustand store에 저장 (setLoginState 사용)
    useAuthStore.getState().login({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
      password: "",
    });

    // 3. 닉네임 여부에 따라 리다이렉트
    if (!user.nickname) {
      router.push("/onboarding/1");
    } else {
      router.push("/mainpage");
    }
  } catch (error) {
    console.error("[OAuth Callback] Error:", error);
    if (onError && error instanceof Error) {
      onError(error);
    }
    throw error;
  }
};
