import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as authApi from "@/entities/user/api/authApi";
import type {
  LoginFormValues,
  SignupFormValues,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "@/entities/user/model/auth.schema";
import { useAuthStore } from "@/entities/user/model/auth.store";
import axiosInstance from "@/shared/lib/axiosInstance";

// 로그인
export const useLoginMutation = () => {
  const { login: setLoginState } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<authApi.LoginTokens, Error, LoginFormValues>({
    mutationFn: authApi.login,
    onSuccess: async (tokens, variables) => {
      // 1) 토큰 보관 (로그인 직후는 프로필 정보 없음 - prefetch로 채움)
      const tempUser = {
        id: tokens.userId,
      };

      setLoginState({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: tempUser,
        password: variables.password,
      });

      // 2) axios 인스턴스에 Authorization 주입 (중복 401 방지)
      if (tokens?.accessToken) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;
      }

      // 3) 프로필 정보 prefetch (프로필 로딩 최적화)
      try {
        const profile = await queryClient.fetchQuery({
          queryKey: ["user", "me"],
          queryFn: authApi.getCurrentUser,
          staleTime: 1000 * 60 * 10, // 10분 신선
        });
        // 프로필 데이터로 스토어 동기화
        useAuthStore.getState().setUser(profile);
      } catch (err) {
        // 프로필 조회 실패는 무시 (필요시 화면에서 재조회 가능)
        console.warn(
          "[Auth] 프로필 prefetch 실패:",
          err instanceof Error ? err.message : String(err),
        );
      }
    },
    onError: (error) => {
      console.error("[Auth] 로그인 실패:", error.message);
    },
  });
};

// 회원가입
export const useSignupMutation = () => {
  const { login: setLoginState } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<authApi.SignupSuccessData, Error, SignupFormValues>({
    mutationFn: authApi.signup,
    onSuccess: async (data) => {
      // 1) 토큰 보관 (signup에서 즉시 토큰 반환)
      const newUser = {
        id: data.id,
      };

      setLoginState({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: newUser,
      });

      // 2) axios 인스턴스에 Authorization 주입
      if (data?.accessToken) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      }

      // 3) 프로필 정보 prefetch (선택사항 - 온보딩에서 조회 가능)
      try {
        const profile = await queryClient.fetchQuery({
          queryKey: ["user", "me"],
          queryFn: authApi.getCurrentUser,
          staleTime: 1000 * 60 * 10,
        });
        useAuthStore.getState().setUser(profile);
      } catch (err) {
        // 프로필 조회 실패는 무시 (온보딩에서 재조회 가능)
        console.warn(
          "[Auth] 회원가입 후 프로필 prefetch 실패:",
          err instanceof Error ? err.message : String(err),
        );
      }
    },
    onError: (error) => {
      console.error("[Auth] 회원가입 실패:", error.message);
    },
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
