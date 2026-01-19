"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { getCurrentUserWithToken } from "@/entities/user/api/authApi";
import {
  VALID_PROVIDERS,
  PROVIDER_DISPLAY_NAMES,
} from "@/entities/user/lib/constants/oauth.const";
import { useAuthStore } from "@/entities/user/model/auth.store";
import type { OAuthProvider } from "@/entities/user/model/auth.types";
import { Toast } from "@/shared";

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
  const toastTimerRef = useRef<number | null>(null);

  const provider = params.provider as string;

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setShowToast(false);
      toastTimerRef.current = null;
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, []);

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

  const providerName = PROVIDER_DISPLAY_NAMES[provider as OAuthProvider] ?? "";

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <span className="text-font-medium">{providerName} 로그인 처리 중...</span>
      <Toast message={toastMessage} show={showToast} />
    </main>
  );
}
