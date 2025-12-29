// TODO: [FSD 마이그레이션] 이 파일은 삭제해도 됩니다.
// 새 위치: src/entities/user/lib/hooks/useAuth.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/api/axios";

import { useAuthStore } from "@/lib/stores/auth.store";
import * as authApi from "@/lib/api/auth";
import type { LoginSuccessData } from "@/lib/api/auth";
import {
  FindPasswordFormValues,
  LoginFormValues,
  ResetPasswordFormValues,
  SignupFormValues,
} from "@/entities_FSD/user/model/auth.schema";

// 로그인
export const useLoginMutation = () => {
  const { login: setLoginState } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<any, Error, LoginFormValues>({
    mutationFn: authApi.login,
    onSuccess: async (tokens, variables) => {
      // 1) 토큰 보관
      setLoginState({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: tokens.userId,
          email: "",
          nickname: "",
          profileImageUrl: null,
          gender: null as any,
          body_type: null as any,
          exercise: null as any,
          prefer: [],
          allergy: [],
          created_at: "",
          updated_at: "",
        } as LoginSuccessData,
        password: (variables as any).password,
      } as any);

      // 2) axios 인스턴스에 Authorization 주입 (중복 401 방지)
      if (tokens?.accessToken) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;
      }

      // 3) 프로필은 react-query 캐시에 미리 채워서, 화면 훅(useUserQuery)이 중복 호출하지 않도록 함
      try {
        const me = await queryClient.fetchQuery({
          queryKey: ["user", "me"],
          queryFn: authApi.getCurrentUser,
          staleTime: 1000 * 60 * 10, // 10분 신선
        });
        // 스토어와 동기화
        useAuthStore.getState().setUser(me as any);
      } catch (e) {
        // 프로필 동기화 실패는 치명적이지 않으니 무시(필요시 로깅)
        // console.error(e);
      }
    },
    onError: (error) => {
      console.error("로그인 실패:", error.message);
    },
  });
};

// 회원가입
export const useSignupMutation = () => {
  return useMutation<authApi.SignupSuccessData, Error, SignupFormValues>({
    mutationFn: authApi.signup,
  });
};

// 로그아웃
export const useLogoutMutation = () => {
  return useMutation<void, Error>({
    mutationFn: authApi.logout,
  });
};

// 이메일 인증코드 전송
export const useSendVerificationCodeMutation = () => {
  return useMutation<authApi.SendVerificationCodeSuccessData, Error, string>({
    mutationFn: (email) => authApi.sendVerificationCode(email),
  });
};

// 이메일 인증코드 검증
export const useVerifyVerificationCodeMutation = () => {
  return useMutation<
    authApi.VerifyVerificationCodeSuccessData,
    Error,
    { email: string; code: string }
  >({
    mutationFn: (data) => authApi.verifyVerificationCode(data),
  });
};

// 비밀번호 재설정 요청
export const useRequestPasswordResetMutation = () => {
  return useMutation<
    authApi.RequestPasswordResetSuccessData,
    Error,
    FindPasswordFormValues
  >({
    mutationFn: authApi.requestPasswordReset,
  });
};

// 비밀번호 재설정
export const useResetPasswordMutation = () => {
  return useMutation<
    string,
    Error,
    ResetPasswordFormValues & { token: string }
  >({
    mutationFn: authApi.resetPassword,
  });
};

// 현재 사용자 조회
export const useUserQuery = () => {
  const token = useAuthStore.getState().accessToken;

  return useQuery({
    queryKey: ["user", "me"],
    queryFn: authApi.getCurrentUser,
    // 토큰이 있어야만 조회 실행
    enabled: !!token,
    // 실패 시 재시도 불필요
    retry: false,
    // 포커스/마운트 시 과도한 재요청 방지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // 로그인 직후 prefetch된 경우, 10분 동안 신선하게 유지
    staleTime: 1000 * 60 * 10,
  });
};
