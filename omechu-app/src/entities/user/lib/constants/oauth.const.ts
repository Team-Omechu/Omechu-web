import type { OAuthProvider } from "@/entities/user/model/auth.types";

/**
 * OAuth 인증 관련 상수
 */

/** 유효한 OAuth 제공자 목록 */
export const VALID_PROVIDERS: OAuthProvider[] = ["kakao", "google"];

/** OAuth 제공자별 표시 이름 */
export const PROVIDER_DISPLAY_NAMES: Record<OAuthProvider, string> = {
  kakao: "카카오",
  google: "구글",
};
