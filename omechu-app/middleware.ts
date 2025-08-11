import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요 없는 페이지 경로 목록
const UNAUTHENTICATED_PATHS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  // 추가적으로 인증 없이 접근 가능한 경로가 있다면 여기에 추가하세요.
  // 예: /about, /terms
];

// 인증된 사용자가 접근해서는 안 되는 페이지 경로 목록 (JWT로 클라이언트에서 처리)
const AUTH_REDIRECT_PATHS: string[] = [];

// NOTE: middleware 함수는 모든 요청에 대해 실행되어 라우팅 또는 리디렉션 등을 처리할 수 있음
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  // NOTE: JWT 기반으로 전환됨. 미들웨어에서는 더 이상 인증 여부를 판단하지 않음.

  // CASE 1: /restaurant-detail?id=123 형식으로 접근 시 → /restaurant-detail/123 으로 리디렉션
  if (pathname === "/restaurant-detail" && searchParams.has("id")) {
    const id = searchParams.get("id");
    const url = request.nextUrl.clone();
    url.pathname = `/restaurant-detail/${id}`; // 동적 세그먼트 경로로 변경
    url.search = ""; // 기존 쿼리스트링 제거
    return NextResponse.redirect(url);
  }

  // CASE 2: /restaurant-detail/map?id=123 형식으로 접근 시 → /restaurant-detail/map/123 으로 리디렉션
  if (pathname === "/restaurant-detail/map" && searchParams.has("id")) {
    const id = searchParams.get("id");
    const url = request.nextUrl.clone();
    url.pathname = `/restaurant-detail/map/${id}`; // 동적 세그먼트 경로로 변경
    url.search = ""; // 기존 쿼리스트링 제거
    return NextResponse.redirect(url);
  }

  // 인증 관련 리다이렉트는 제거함. 라우팅 가드/리다이렉트는 클라이언트 측에서 처리.

  // 기본적으로는 요청을 그대로 통과시킴
  return NextResponse.next();
}

// NOTE: matcher를 설정하면 특정 경로에만 middleware를 적용 가능
// 미들웨어가 모든 경로에서 실행되도록 matcher를 수정합니다.
export const config = {
  matcher: [
    /*
     * 아래와 일치하는 경로를 제외한 모든 요청 경로에서 미들웨어를 실행합니다:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
