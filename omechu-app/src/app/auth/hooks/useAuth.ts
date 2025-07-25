import { useMutation } from "@tanstack/react-query";

import * as authApi from "@/auth/api/auth";
import type {
  LoginFormValues,
  SignupFormValues,
  OnboardingData,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";
import useAuthStore from "@/auth/store";

export const useLoginMutation = () => {
  const { login: setLoginState } = useAuthStore();

  return useMutation<authApi.LoginSuccessData, Error, LoginFormValues>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // TODO: 백엔드에서 accessToken을 내려주면 그걸 받아서 저장해야 합니다.
      // 지금은 임시로 더미 토큰을 사용합니다.
      const MOCK_ACCESS_TOKEN = "DUMMY_ACCESS_TOKEN_FROM_LOGIN";
      setLoginState(MOCK_ACCESS_TOKEN, data);

      // 성공 후 로직 (예: 메인 페이지로 이동)
      console.log("로그인 성공:", data);
      // router.push('/');
    },
    onError: (error) => {
      // 실패 시 로직 (예: 토스트 메시지 표시)
      console.error("로그인 실패:", error.message);
    },
  });
};

export const useCompleteOnboardingMutation = () => {
  return useMutation<any, Error, authApi.OnboardingData>({
    mutationFn: authApi.completeOnboarding,
  });
};

export const useSignupMutation = () => {
  const { signup: setSignupState } = useAuthStore();

  return useMutation<authApi.SignupSuccessData, Error, SignupFormValues>({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      // 회원가입 성공 시 상태 업데이트
      setSignupState(data);
      console.log("회원가입 성공:", data);
      // router.push('/auth/sign-in');
    },
    onError: (error) => {
      console.error("회원가입 실패:", error.message);
    },
  });
};

export const useLogoutMutation = () => {
  const { logout: clearAuthState } = useAuthStore();
  return useMutation<void, Error>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthState();
      // redirect to login page or home page
    },
  });
};

export const useRequestPasswordResetMutation = () => {
  return useMutation<void, Error, FindPasswordFormValues>({
    mutationFn: authApi.requestPasswordReset,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation<void, Error, ResetPasswordFormValues>({
    mutationFn: authApi.resetPassword,
  });
};
