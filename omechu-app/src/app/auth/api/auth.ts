import type {
  LoginFormValues,
  SignupFormValues,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";
import apiClient from "@/lib/api/client";
// import { useOnboardingStore } from "@/lib/stores/onboarding.store"; // <- 불필요한 import 제거

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

// 이메일 인증번호 전송 성공 시 success 객체 구조
export interface SendVerificationCodeSuccessData {
  message: string;
  code: string;
}

// 이메일 인증번호 검증 성공 시 success 객체 구조
export interface VerifyVerificationCodeSuccessData {
  message: string;
}

// 비밀번호 재설정 요청 성공 시 success 객체 구조
export interface RequestPasswordResetSuccessData {
  message: string;
  token: string;
}

// 온보딩 완료 시 서버 응답 데이터 타입
export interface OnboardingSuccessData {
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
): Promise<OnboardingSuccessData> => {
  // TODO: 백엔드 응답 타입 정의
  const response = await apiClient.patch<ApiResponse<OnboardingSuccessData>>(
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
 * 이메일 인증번호 전송 API
 * @param email
 */
export const sendVerificationCode = async (
  email: string,
): Promise<SendVerificationCodeSuccessData> => {
  const response = await apiClient.post<
    ApiResponse<SendVerificationCodeSuccessData>
  >("/auth/send", { email });

  const apiResponse = response.data;
  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(
      apiResponse.error?.reason || "인증번호 전송에 실패했습니다.",
    );
  }
  return apiResponse.success;
};

/**
 * 이메일 인증번호 확인 API
 * @param data email, code
 */
export const verifyVerificationCode = async (data: {
  email: string;
  code: string;
}): Promise<VerifyVerificationCodeSuccessData> => {
  const response = await apiClient.post<
    ApiResponse<VerifyVerificationCodeSuccessData>
  >("/auth/verify", data);
  const apiResponse = response.data;
  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(apiResponse.error?.reason || "이메일 인증에 실패했습니다.");
  }
  return apiResponse.success;
};

/**
 * 비밀번호 재설정 요청 API
 */
export const requestPasswordReset = async (
  data: FindPasswordFormValues,
): Promise<RequestPasswordResetSuccessData> => {
  const response = await apiClient.post<
    ApiResponse<RequestPasswordResetSuccessData>
  >("/auth/reset-request", data);
  const apiResponse = response.data;
  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(
      apiResponse.error?.reason || "비밀번호 재설정 요청에 실패했습니다.",
    );
  }
  return apiResponse.success;
};

/**
 * 비밀번호 재설정 API
 */
export const resetPassword = async (
  data: ResetPasswordFormValues,
): Promise<string> => {
  const response = await apiClient.patch<ApiResponse<string>>(
    "/auth/passwd",
    { newPassword: data.password }, // API 명세에 맞게 newPassword 필드로 전송
  );
  const apiResponse = response.data;
  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(
      apiResponse.error?.reason || "비밀번호 재설정에 실패했습니다.",
    );
  }
  return apiResponse.success;
};

/**
 * 로그아웃 API
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
