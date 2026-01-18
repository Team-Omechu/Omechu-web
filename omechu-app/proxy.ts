import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy - URL 리라이트 처리 (Next.js 16)
 *
 * 쿼리 파라미터 방식의 URL을 동적 세그먼트 방식으로 리다이렉트합니다.
 * 인증 관련 로직은 클라이언트(ClientLayout)에서 처리합니다.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // /restaurant-detail?id=123 → /restaurant-detail/123
  if (pathname === "/restaurant-detail" && searchParams.has("id")) {
    const id = searchParams.get("id");
    const url = request.nextUrl.clone();
    url.pathname = `/restaurant-detail/${id}`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // /restaurant-detail/map?id=123 → /restaurant-detail/map/123
  if (pathname === "/restaurant-detail/map" && searchParams.has("id")) {
    const id = searchParams.get("id");
    const url = request.nextUrl.clone();
    url.pathname = `/restaurant-detail/map/${id}`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// NOTE: matcher를 설정하면 특정 경로에만 proxy를 적용 가능
export const config = {
  matcher: [
    /*
     * 아래와 일치하는 경로를 제외한 모든 요청 경로에서 proxy를 실행합니다:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
