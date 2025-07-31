import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { headers } = request;
    const cookie = headers.get("cookie");

    // 백엔드 API로 로그아웃 요청을 보냅니다.
    // 백엔드 세션은 이 요청으로 만료됩니다.
    const apiResponse = await fetch("https://omechu-api.log8.kr/auth/logout", {
      method: "POST",
      headers: { ...(cookie && { cookie }) },
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      // 백엔드 응답이 실패하면 에러를 반환합니다.
      return NextResponse.json(data, { status: apiResponse.status });
    }

    // 백엔드 응답 성공 여부와 관계없이 브라우저의 쿠키를 삭제합니다.
    const response = NextResponse.json(data);

    // 'connect.sid' 쿠키를 삭제하기 위해 만료시킵니다.
    response.cookies.set("connect.sid", "", {
      path: "/",
      httpOnly: true,
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
