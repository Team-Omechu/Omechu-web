"use client";

import { useEffect, useRef } from "react";

import { useAuthStore } from "@/entities/user/model/auth.store";
import { setupAxiosInterceptors } from "@/shared/lib/axiosInstance";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider
 * - Axios 인터셉터 초기화 (토큰 갱신, 401 처리)
 * - 앱 전체에서 한 번만 실행
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const interceptorsInitialized = useRef(false);

  useEffect(() => {
    if (!interceptorsInitialized.current) {
      setupAxiosInterceptors(useAuthStore);
      interceptorsInitialized.current = true;
    }
  }, []);

  return <>{children}</>;
}
