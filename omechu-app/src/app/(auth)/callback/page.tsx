"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "@/entities/user/model/auth.store";
import { getCurrentUser } from "@/entities/user/api/authApi";
import Toast from "@/shared/ui/toast";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <span className="text-grey-normal-active">로그인 처리 중...</span>
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
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken) {
      triggerToast("로그인에 실패했습니다. 다시 시도해 주세요.");
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
        triggerToast("로그인에 실패했습니다. 다시 시도해 주세요.");
        router.replace("/sign-in");
      }
    })();
  }, [params, router, login]);

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <>
        <span className="text-grey-normal-active">로그인 처리 중...</span>
        <Toast message={toastMessage} show={showToast} />
      </>
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
