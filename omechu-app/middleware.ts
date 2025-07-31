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
  const isLoggedIn = request.cookies.has("connect.sid"); // 세션 쿠키 이름은 백엔드 설정에 따라 확인 필요

  if (isLoggedIn) {
    // 로그인한 사용자가 Public-Only 페이지에 접근 시, 마이페이지로 리디렉션
    if (PUBLIC_ONLY_PATHS.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/mypage", request.url));
    }
  } else {
    // 로그인하지 않은 사용자가 보호된 페이지에 접근 시, 로그인 페이지로 리디렉션
    if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
      // 리디렉션 후 원래 가려던 경로를 쿼리 파라미터로 추가할 수 있습니다 (선택 사항).
      // const url = new URL("/sign-in", request.url);
      // url.searchParams.set("redirect_to", pathname);
      // return NextResponse.redirect(url);
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
