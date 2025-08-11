import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import * as authApi from "@/lib/api/auth";
import type {
  LoginFormValues,
  SignupFormValues,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";
// import type { OnboardingData } from "@/onboarding/api/onboarding";
import { useAuthStore } from "@/lib/stores/auth.store";

export const useLoginMutation = () => {
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: async (tokens: any, variables) => {
      // tokens: { userId, accessToken, refreshToken } 형태를 기대
      // 우선 토큰 저장 후 프로필로 user 세팅
      setAuth({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: tokens.userId,
          email: "",
          gender: "남성",
          nickname: "",
          created_at: "",
          updated_at: "",
        },
        password: variables.password,
      });
      const me = await authApi.getCurrentUser();
      useAuthStore.getState().setUser(me);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useCompleteOnboardingMutation = () => {
  const router = useRouter();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: (data: authApi.OnboardingData) => {
      // 서버로 보내기 직전, gender 값을 백엔드 명세에 맞게 변환합니다.
      const transformedData = {
        ...data,
        gender: data.gender === "남성" ? "남자" : "여자",
      };
      return authApi.completeOnboarding(transformedData as any);
    },
    onSuccess: (data) => {
      // 온보딩 성공 시 스토어의 유저 정보를 업데이트하고 메인페이지로 이동
      storeLogin(data as any);
      router.push("/mainpage");
      `ㅁ`;
    },
    onError: (error) => {
      // TODO: 에러 처리 로직 (예: 토스트 메시지)
      console.error("Onboarding failed:", error);
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
