"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "@/lib/stores/auth.store";
import { getCurrentUser } from "@/lib/api/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken) {
      router.replace("/sign-in");
      return;
    }

    (async () => {
      try {
        // 토큰을 먼저 저장하지 않고, 토큰을 헤더로만 사용해 프로필 조회
        // getCurrentUser는 axios 인터셉터에 의해 store의 토큰을 읽지만
        // 콜백 단계에서는 직접 헤더를 붙여 1회성으로 호출하는 방식으로 대체할 수 있습니다.
        // 여기서는 간단히 store에 최종 상태 한 번만 쓰도록 토큰과 함께 user를 설정합니다.

        // 우선 user 프로필 요청
        const me = await getCurrentUserWithToken(accessToken);

        // 최종 한 번의 로그인 상태 설정
        login({
          accessToken,
          refreshToken: refreshToken ?? "",
          user: me,
          password: "",
        });

        if (!me.nickname) router.replace("/onboarding/1");
        else router.replace("/mainpage");
      } catch (e) {
        router.replace("/sign-in");
      }
    })();
  }, [params, router, login]);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center">
      <span className="text-gray-500">로그인 처리 중...</span>
    </main>
  );
}

// 토큰을 직접 헤더에 붙여 현재 사용자 정보를 1회성으로 불러오는 헬퍼
async function getCurrentUserWithToken(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  const data = await res.json();
  if (data?.resultType !== "SUCCESS" || !data?.success) {
    throw new Error(data?.error?.reason || "유저 조회 실패");
  }
  return data.success;
}
