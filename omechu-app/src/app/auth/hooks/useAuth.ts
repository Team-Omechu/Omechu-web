import { useMutation } from "@tanstack/react-query";

import * as authApi from "@/auth/api/auth";
import type {
  LoginFormValues,
  SignupFormValues,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";
// import type { OnboardingData } from "@/onboarding/api/onboarding";
import useAuthStore from "@/auth/store";

export const useLoginMutation = () => {
  const { login: setLoginState } = useAuthStore();

  return useMutation<authApi.LoginSuccessData, Error, LoginFormValues>({
    mutationFn: authApi.login,
    onSuccess: (userProfile) => {
      // 일반 로그인이므로 accessToken 없이 userProfile만 넘겨서 로그인 상태로 만듭니다.
      setLoginState(userProfile);
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

export const useSendVerificationCodeMutation = () => {
  return useMutation<authApi.SendVerificationCodeSuccessData, Error, string>({
    mutationFn: (email) => authApi.sendVerificationCode(email),
  });
};

export const useVerifyVerificationCodeMutation = () => {
  return useMutation<
    authApi.VerifyVerificationCodeSuccessData,
    Error,
    { email: string; code: string }
  >({
    mutationFn: (data) => authApi.verifyVerificationCode(data),
  });
};

export const useSignupMutation = () => {
  // const { signup: setSignupState } = useAuthStore(); // <- 이 부분이 오류의 원인입니다.
  return useMutation<authApi.SignupSuccessData, Error, SignupFormValues>({
    mutationFn: authApi.signup,
    // onSuccess/onError는 사용하는 컴포넌트에서 개별적으로 처리하도록 비워둡니다.
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
