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

export const useLoginMutation = () => {
  const { login: setAuth } = useAuthStore();
  const router = useRouter(); // onSuccess에서 라우팅을 위해 추가

  return useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: (response) => {
      // TODO: 백엔드에서 실제 accessToken을 내려주면 "DUMMY_ACCESS_TOKEN"을 교체해야 합니다.
      setAuth({
        accessToken: "DUMMY_ACCESS_TOKEN", // 임시 토큰
        user: response,
      });
      // 로그인 성공 후 메인 페이지로 이동
      router.push("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // 사용자에게 실패 피드백 (예: alert, toast)
      alert("이메일 또는 비밀번호가 일치하지 않습니다.");
    },
  });
};

export const useCompleteOnboardingMutation = () => {
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: authApi.OnboardingData) =>
      authApi.completeOnboarding(data),
    onSuccess: (data) => {
      // 온보딩 성공 시 스토어의 유저 정보만 업데이트
      setUser(data);
      // 자동 로그인이 되지 않으므로 로그인 페이지로 이동하여 사용자에게 로그인을 유도
      alert("회원가입이 완료되었습니다. 다시 로그인해주세요.");
      router.push("/sign-in");
    },
    onError: (error) => {
      // TODO: 에러 처리 로직 (예: 토스트 메시지)
      console.error("Onboarding failed:", error);
      alert(`온보딩 처리 중 오류가 발생했습니다: ${error.message}`);
    },
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
