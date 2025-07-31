import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증된 사용자만 접근 가능한 페이지 경로 (prefix)
const PROTECTED_PATHS = ["/onboarding", "/mypage", "/fullmenu", "/restaurant"];

// 인증되지 않은 사용자만 접근 가능한 페이지 경로 (prefix)
const PUBLIC_ONLY_PATHS = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

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

  // --- 인증 관련 로직 시작 ---
  console.log(`[Middleware] Path: ${pathname}`);
  console.log("[Middleware] All Cookies:", request.cookies.getAll());
  const isLoggedIn = request.cookies.has("connect.sid");
  console.log(`[Middleware] isLoggedIn: ${isLoggedIn}`);

  if (isLoggedIn) {
    // 로그인한 사용자가 Public-Only 페이지에 접근 시, 메인페이지로 리디렉션
    if (PUBLIC_ONLY_PATHS.some((path) => pathname.startsWith(path))) {
      console.log("[Middleware] Redirecting logged-in user to /mainpage");
      return NextResponse.redirect(new URL("/mainpage", request.url));
    }
  } else {
    // 로그인하지 않은 사용자가 보호된 페이지에 접근 시, 로그인 페이지로 리디렉션
    if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
      console.log("[Middleware] Redirecting logged-out user to /sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
  // --- 인증 관련 로직 끝 ---

  // 그 외의 경우는 요청을 그대로 통과
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 아래와 일치하는 경로를 제외한 모든 요청 경로에서 미들웨어를 실행합니다:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * - public 폴더 내부의 모든 것 (이미지, 폰트 등)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
