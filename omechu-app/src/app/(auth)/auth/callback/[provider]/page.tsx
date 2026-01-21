"use client";

import { Suspense, useEffect } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useKakaoLogin } from "@/entities/user";
import { Toast, useToast } from "@/shared";

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
  const { handleKakaoCallback } = useKakaoLogin();
  const { show: showToast, message: toastMessage, triggerToast } = useToast();

  const provider = params.provider as string;
  const code = searchParams.get("code");

  useEffect(() => {
    // Kakao 전용 (Google은 popup 방식이므로 이 페이지 사용 안함)
    if (provider !== "kakao") {
      triggerToast("잘못된 로그인 경로입니다.");
      router.replace("/login");
      return;
    }

    if (!code) {
      triggerToast("인증 코드가 없습니다.");
      router.replace("/login");
      return;
    }

    // Kakao authorization code 처리
    handleKakaoCallback(code);
  }, [provider, code, handleKakaoCallback, router, triggerToast]);

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <span className="text-font-medium">카카오 로그인 처리 중...</span>
      <Toast message={toastMessage} show={showToast} />
    </main>
  );
}
