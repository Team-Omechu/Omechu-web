"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "@/auth/store";
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
        // 1) accessToken을 우선 저장하여 이후 API 호출에 인증 헤더가 포함되도록 함
        login({
          accessToken,
          user: {
            id: "",
            email: "",
            gender: "남성",
            nickname: "",
            created_at: "",
            updated_at: "",
            accessToken,
          },
          password: "",
        });

        // 2) 현재 사용자 정보를 조회하여 스토어 업데이트
        const me = await getCurrentUser();
        login({ accessToken, user: me, password: "" });

        // 3) 온보딩 여부에 따라 라우팅
        if (!me.nickname) {
          router.replace("/onboarding/1");
        } else {
          router.replace("/mainpage");
        }
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
