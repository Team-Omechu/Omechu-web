import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { headers } = request;
    const cookie = headers.get("cookie");

    const apiResponse = await fetch("https://omechu-api.log8.kr/auth/logout", {
      method: "POST",
      headers: { ...(cookie && { cookie }) },
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(data, { status: apiResponse.status });
    }

    const setCookieHeader = apiResponse.headers.get("set-cookie");
    const response = NextResponse.json(data);

    if (setCookieHeader) {
      // ★★★ 중요: Domain 속성과 Secure 플래그를 모두 제거합니다.
      const modifiedCookieHeader = setCookieHeader
        .replace(/;\s*domain=[^;]+/i, "")
        .replace(/;\s*secure/i, "");

      response.headers.set("set-cookie", modifiedCookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Logout proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
