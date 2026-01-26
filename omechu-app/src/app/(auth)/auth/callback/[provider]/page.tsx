"use client";

import { Suspense, useEffect, useRef } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { getCurrentUserWithToken, useAuthStore } from "@/entities/user";
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
  const { show: showToast, message: toastMessage, triggerToast } = useToast();
  const processedRef = useRef(false);

  const provider = params.provider as string;

  // URL 쿼리에서 토큰 추출
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  // 에러 파라미터 (BE에서 에러 시 전달할 수 있음)
  const error = searchParams.get("error");

  useEffect(() => {
    // 중복 실행 방지
    if (processedRef.current) return;

    const handleCallback = async () => {
      processedRef.current = true;

      // provider 검증
      if (provider !== "kakao" && provider !== "google") {
        triggerToast("잘못된 로그인 경로입니다.");
        router.replace("/login");
        return;
      }

      // 에러 처리
      if (error) {
        triggerToast(
          error === "access_denied"
            ? "로그인이 취소되었습니다."
            : "로그인에 실패했습니다.",
        );
        router.replace("/login");
        return;
      }

      // 토큰 검증
      if (!accessToken) {
        triggerToast("인증 정보가 없습니다.");
        router.replace("/login");
        return;
      }

      try {
        // 1. 토큰으로 유저 정보 조회
        const user = await getCurrentUserWithToken(accessToken);

        // 2. Zustand store에 저장
        useAuthStore.getState().login({
          accessToken,
          refreshToken: refreshToken || "",
          user,
          password: "",
        });

        // 3. 닉네임 여부에 따라 리다이렉트
        if (!user.nickname) {
          router.replace("/onboarding/1");
        } else {
          router.replace("/mainpage");
        }
      } catch (err) {
        console.error(`[${provider} Callback] Error:`, err);
        triggerToast("로그인 처리 중 오류가 발생했습니다.");
        router.replace("/login");
      }
    };

    handleCallback();
  }, [provider, accessToken, refreshToken, error, router, triggerToast]);

  const providerName =
    provider === "kakao" ? "카카오" : provider === "google" ? "구글" : "";

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <span className="text-font-medium">{providerName} 로그인 처리 중...</span>
      <Toast message={toastMessage} show={showToast} />
    </main>
  );
}
