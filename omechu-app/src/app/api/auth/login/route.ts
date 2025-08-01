import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiResponse = await fetch("https://omechu-api.log8.kr/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(data, { status: apiResponse.status });
    }

    const setCookieHeader = apiResponse.headers.get("set-cookie");
    const response = NextResponse.json(data);

    if (setCookieHeader) {
      console.log("[Login Route] Original set-cookie header:", setCookieHeader);

      // 백엔드에서 온 set-cookie 헤더를 세미콜론(;)으로 분리하여 각 부분을 배열로 만듭니다.
      const cookieParts = setCookieHeader.split(";").map((part) => part.trim());

      // 로컬 환경에 맞지 않는 속성들을 걸러냅니다.
      const filteredParts = cookieParts.filter((part) => {
        const key = part.split("=")[0].trim().toLowerCase();
        // Domain, Secure, SameSite 속성을 제거합니다.
        return key !== "domain" && key !== "secure" && key !== "samesite";
      });

      // Path가 명시적으로 없는 경우, 전체 사이트에서 쿠키를 사용할 수 있도록 Path=/ 를 추가합니다.
      const hasPath = filteredParts.some((part) =>
        part.trim().toLowerCase().startsWith("path="),
      );
      if (!hasPath) {
        filteredParts.push("Path=/");
      }

      // 필터링되고 수정된 부분들을 다시 합쳐서 유효한 쿠키 헤더 문자열을 만듭니다.
      const modifiedCookieHeader = filteredParts.join("; ");

      console.log(
        "[Login Route] Modified set-cookie header:",
        modifiedCookieHeader,
      );

      response.headers.set("set-cookie", modifiedCookieHeader);
    }

    return response;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
