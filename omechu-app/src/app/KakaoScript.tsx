"use client";

import Script from "next/script";

/**
 * Kakao SDK 로더
 * - Server Component에서는 onLoad 핸들러를 Client Component props로 전달할 수 없음
 * - 별도의 Client Component로 분리하여 해결
 */
export function KakaoScript() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
      integrity="sha384-l+xbElFSnPZ2rOaPrU//2FF5B4LB8FiX5q4fXYTlfcG4PGpMkE1vcL7kNXI6Cci0"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (
          typeof window !== "undefined" &&
          window.Kakao &&
          !window.Kakao.isInitialized()
        ) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!);
        }
      }}
    />
  );
}
