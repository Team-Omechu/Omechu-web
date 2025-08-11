"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "@/lib/stores/auth.store";
import { getCurrentUser } from "@/lib/api/auth";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[100dvh] items-center justify-center">
          <span className="text-gray-500">로그인 처리 중...</span>
        </main>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

function CallbackContent() {
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
        const me = await getCurrentUserWithToken(accessToken);
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
