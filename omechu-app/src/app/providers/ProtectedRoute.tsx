"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/entities/user/model/auth.store";
import { MainLoading } from "@/shared/ui/MainLoading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute
 * - 로그인이 필요한 페이지를 감싸는 컴포넌트
 * - 미로그인 시 /sign-in으로 리다이렉트
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Zustand persist 하이드레이션 대기
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      const state = useAuthStore.getState();

      if (!state.isLoggedIn) {
        router.replace("/sign-in");
      } else {
        setIsChecking(false);
      }
    });

    // 이미 하이드레이션이 완료된 경우
    if (useAuthStore.persist.hasHydrated()) {
      if (!isLoggedIn) {
        router.replace("/sign-in");
      } else {
        setIsChecking(false);
      }
    }

    return () => {
      unsubscribe();
    };
  }, [isLoggedIn, router]);

  if (isChecking) {
    return <MainLoading />;
  }

  return <>{children}</>;
}
