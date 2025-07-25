import type {
  LoginFormValues,
  SignupFormValues,
} from "@/auth/schemas/auth.schema";
import apiClient from "@/lib/api/client";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

// API 응답의 기본 구조
export interface ApiResponse<T> {
  resultType: "SUCCESS" | "FAIL";
  error: ApiError | null;
  success: T | null;
}

// API 에러 객체 구조
export interface ApiError {
  errorCode: string;
  reason: string;
  data?: unknown;
}

// 회원가입 성공 시 success 객체 구조
export interface SignupSuccessData {
  id: number;
  email: string;
  phoneNumber: string;
  created_at: string;
  updated_at: string;
}

// 로그인 성공 시 success 객체 구조
export interface LoginSuccessData {
  id: string;
  email: string;
  gender: "남성" | "여성";
  nickname: string;
  created_at: string;
  updated_at: string;
}

// 온보딩 완료 시 서버로 보낼 데이터 타입
export interface OnboardingData {
  nickname: string;
  gender: "여성" | "남성" | null;
  workoutStatus: string | null;
  preferredFood: string[];
  constitution: string[];
  allergy: string[];
}

/**
 * 로그인 API
 * @param data email, password
 */
export const login = async (
  data: LoginFormValues,
): Promise<LoginSuccessData> => {
  const response = await apiClient.post<ApiResponse<LoginSuccessData>>(
    "/auth/login",
    data,
  );

  const apiResponse = response.data;

  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    // resultType이 FAIL이거나 success 필드가 없을 경우, 에러를 발생시켜
    // TanStack Query의 onError 콜백을 트리거합니다.
    throw new Error(apiResponse.error?.reason || "로그인에 실패했습니다.");
  }

  return apiResponse.success;
};

/**
 * 회원가입 API
 * @param data email, password 등 회원가입 정보
 */
export const signup = async (
  data: SignupFormValues,
): Promise<SignupSuccessData> => {
  const { verificationCode, passwordConfirm, ...rest } = data;
  const response = await apiClient.post<ApiResponse<SignupSuccessData>>(
    "/auth/signup",
    rest,
  );
  const apiResponse = response.data;
  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(apiResponse.error?.reason || "회원가입에 실패했습니다.");
  }
  return apiResponse.success;
};

/**
 * 회원가입 완료 (온보딩 데이터 전송) API
 */
export const completeOnboarding = async (
  data: OnboardingData,
): Promise<any> => {
  // TODO: 백엔드 응답 타입 정의
  const response = await apiClient.patch<ApiResponse<any>>(
    "/auth/complete",
    data,
  );

  const apiResponse = response.data;

  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(
      apiResponse.error?.reason || "온보딩 정보 저장에 실패했습니다.",
    );
  }

  return apiResponse.success;
};

/**
 * 토큰 재발급 API
 */
export const reissueToken = async (): Promise<{ accessToken: string }> => {
  // TODO: Define proper type
  const response =
    await apiClient.post<ApiResponse<{ accessToken: string }>>("/auth/reissue");

  const apiResponse = response.data;

  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(apiResponse.error?.reason || "토큰 재발급에 실패했습니다.");
  }

  return apiResponse.success;
};

/**
 * 이메일 인증번호 전송 API
 * @param email
 */
export const sendEmailVerificationCode = async (
  email: string,
): Promise<void> => {
  await apiClient.post("/auth/send-verification-code", { email });
};

/**
 * 비밀번호 재설정 요청 API
 */
export const requestPasswordReset = async (
  data: FindPasswordFormValues,
): Promise<void> => {
  await apiClient.post("/auth/reset-request", data);
};

/**
 * 비밀번호 재설정 API
 */
export const resetPassword = async (
  data: ResetPasswordFormValues,
): Promise<void> => {
  await apiClient.patch("/auth/reset-passwd", data);
};

/**
 * 로그아웃 API
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
