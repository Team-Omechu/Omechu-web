import { useMutation, useQuery } from "@tanstack/react-query";

import type {
  LoginFormValues,
  SignupFormValues,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";
import { useAuthStore } from "@/lib/stores/auth.store";
import * as authApi from "@/lib/api/auth";
import type { LoginSuccessData } from "@/lib/api/auth";

// 로그인
export const useLoginMutation = () => {
  const { login: setLoginState } = useAuthStore();

  return useMutation<any, Error, LoginFormValues>({
    mutationFn: authApi.login,
    onSuccess: async (tokens, variables) => {
      setLoginState({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: tokens.userId,
          email: "",
          gender: "남성",
          nickname: "",
          created_at: "",
          updated_at: "",
        } as LoginSuccessData,
        password: (variables as any).password,
      } as any);
      const me = await authApi.getCurrentUser();
      useAuthStore.getState().setUser(me);
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
  return useQuery({
    // queryKey는 TanStack Query가 데이터를 캐싱하고 관리하는 데 사용하는 고유 키입니다.
    queryKey: ["user", "me"],
    // queryFn은 실제로 데이터를 가져오는 비동기 함수입니다.
    // auth.ts 파일에 이미 만들어져 있는 getCurrentUser를 사용합니다.
    queryFn: authApi.getCurrentUser,
    // 이 쿼리는 사용자가 앱에 처음 들어왔을 때 세션이 있는지 확인하는 용도이므로,
    // 실패 시 자동으로 재시도할 필요는 없습니다.
    retry: false,
    // 창에 포커스가 돌아올 때마다 데이터를 다시 가져오지 않도록 설정합니다.
    refetchOnWindowFocus: false,
    // 컴포넌트가 마운트될 때마다 데이터를 다시 가져오지 않도록 설정합니다.
    refetchOnMount: false,
  });
};
