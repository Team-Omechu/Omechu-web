"use client";

import { Suspense, useEffect, useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "@/entities/user/model/auth.store";
import { Toast } from "@/shared";

type OAuthProvider = "kakao" | "google";

const VALID_PROVIDERS: OAuthProvider[] = ["kakao", "google"];

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <span className="text-font-medium">로그인 처리 중...</span>
        </main>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

function CallbackContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const provider = params.provider as string;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  useEffect(() => {
    // provider 유효성 검사
    if (!VALID_PROVIDERS.includes(provider as OAuthProvider)) {
      triggerToast("잘못된 로그인 경로입니다.");
      router.replace("/sign-in");
      return;
    }

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

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

        // 닉네임이 없으면 온보딩으로, 있으면 메인페이지로
        if (!me.nickname) {
          router.replace("/onboarding/1");
        } else {
          router.replace("/mainpage");
        }
      } catch {
        triggerToast("로그인에 실패했습니다. 다시 시도해 주세요.");
        router.replace("/sign-in");
      }
    })();
  }, [provider, searchParams, router, login]);

  const providerName = provider === "kakao" ? "카카오" : provider === "google" ? "구글" : "";

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <span className="text-font-medium">
        {providerName} 로그인 처리 중...
      </span>
      <Toast message={toastMessage} show={showToast} />
    </main>
  );
}

/**
 * 토큰을 직접 헤더에 붙여 현재 사용자 정보를 1회성으로 불러오는 헬퍼
 */
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
