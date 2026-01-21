/**
 * OAuth 인증 관련 타입 정의
 */

/** 지원하는 OAuth 제공자 */
export type OAuthProvider = "kakao" | "google";

/** OAuth 에러 인터페이스 */
export interface OAuthError {
  code: string;
  message: string;
}
