import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import * as authApi from "@/lib/api/auth";
import type {
  LoginFormValues,
  SignupFormValues,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";
import { useAuthStore } from "@/auth/store";

// useLoginMutation ... (이전 제안과 동일하게 유지)

export const useLoginMutation = () => {
  const { login: setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: (response) => {
      setAuth({
        accessToken: "DUMMY_ACCESS_TOKEN", // 임시 토큰
        user: response,
      });
      router.push("/mainpage");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      alert("이메일 또는 비밀번호가 일치하지 않습니다.");
    },
  });
};

// useCompleteOnboardingMutation ... (이전 제안과 동일하게 as any 제거)
export const useCompleteOnboardingMutation = () => {
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: authApi.OnboardingData) =>
      authApi.completeOnboarding(data),
    onSuccess: (data) => {
      setUser(data);
      alert("회원가입이 완료되었습니다. 다시 로그인해주세요.");
      router.push("/sign-in");
    },
    onError: (error) => {
      console.error("Onboarding failed:", error);
      alert(`온보딩 처리 중 오류가 발생했습니다: ${error.message}`);
    },
  });
};

// ... 여기에 useSendVerificationCodeMutation, useSignupMutation 등 모든 인증 관련 훅을 추가 ...
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
  return useMutation<authApi.SignupSuccessData, Error, SignupFormValues>({
    mutationFn: authApi.signup,
  });
};

export const useLogoutMutation = () => {
  const { logout: clearAuthState } = useAuthStore();
  return useMutation<void, Error>({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthState();
    },
  });
};

export const useRequestPasswordResetMutation = () => {
  return useMutation<
    authApi.RequestPasswordResetSuccessData,
    Error,
    FindPasswordFormValues
  >({
    mutationFn: authApi.requestPasswordReset,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation<string, Error, ResetPasswordFormValues>({
    mutationFn: authApi.resetPassword,
  });
};
