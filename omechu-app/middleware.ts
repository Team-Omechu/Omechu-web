import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NOTE: middleware 함수는 모든 요청에 대해 실행되어 라우팅 또는 리디렉션 등을 처리할 수 있음
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

  // 기본적으로는 요청을 그대로 통과시킴
  return NextResponse.next();
}

// NOTE: matcher를 설정하면 특정 경로에만 middleware를 적용 가능 (선택사항)
export const config = {
  matcher: ["/restaurant-detail", "/restaurant-detail/map"],
};
