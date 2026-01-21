"use client";

import { GoogleOAuthProvider as Provider } from "@react-oauth/google";

interface GoogleOAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Google OAuth Provider 래퍼
 * - @react-oauth/google의 GoogleOAuthProvider를 설정
 * - clientId 자동 주입
 */
export function GoogleOAuthProvider({
  children,
}: GoogleOAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error(
      "[Google OAuth] NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다."
    );
    return <>{children}</>;
  }

  return <Provider clientId={clientId}>{children}</Provider>;
}
