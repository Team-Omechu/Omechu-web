import type { AxiosResponse } from "axios";
import type {
  LoginFormValues,
  SignupFormValues,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";
import apiClient from "./client";

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

// 공통 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl: string;
  gender: "남성" | "여성";
  body_type: string;
  state: string;
  prefer: string[];
  created_at: string;
  updated_at: string;
}

// 회원가입 성공 시 success 객체 구조
export interface SignupSuccessData {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

// 이메일 인증번호 전송 성공 시 success 객체 구조
export interface SendVerificationCodeSuccessData {
  message: string;
  code: string;
}

// 이메일 인증번호 검증 파라미터
export interface VerifyVerificationCodeParams {
  email: string;
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

// 온보딩 완료 시 서버로 보낼 데이터 타입
export interface OnboardingData {
  nickname: string;
  gender: "여성" | "남성" | null;
  workoutStatus: string | null;
  preferredFood: string[];
  constitution: string[];
  allergy: string[];
}

function handleApiResponse<T>(
  response: AxiosResponse<ApiResponse<T>>,
  defaultErrorMessage: string,
): T {
  const apiResponse = response.data;
  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(apiResponse.error?.reason || defaultErrorMessage);
  }
  return apiResponse.success;
}

/**
 * 로그인 API
 * @param data email, password
 */
export const login = async (data: LoginFormValues): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>(
    "/auth/login",
    data,
    // * 이삭 추가 부분
    { withCredentials: true },
  );
  return handleApiResponse(response, "로그인에 실패했습니다.");
};

/**
 * 회원가입 API
 * @param data email, password 등 회원가입 정보
 */
export const signup = async (
  data: SignupFormValues,
): Promise<SignupSuccessData> => {
  const { email, password } = data;
  const response = await apiClient.post<ApiResponse<SignupSuccessData>>(
    "/auth/signup",
    { email, password },
  );
  return handleApiResponse(response, "회원가입에 실패했습니다.");
};

/**
 * 회원가입 완료 (온보딩 데이터 전송) API
 */
export const completeOnboarding = async (
  data: OnboardingData,
): Promise<User> => {
  const response = await apiClient.patch<ApiResponse<User>>(
    "/auth/complete",
    data,
  );
  return handleApiResponse(response, "온보딩 정보 저장에 실패했습니다.");
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
  return handleApiResponse(response, "인증번호 전송에 실패했습니다.");
};

/**
 * 이메일 인증번호 확인 API
 * @param data email, code
 */
export const verifyVerificationCode = async (
  data: VerifyVerificationCodeParams,
): Promise<VerifyVerificationCodeSuccessData> => {
  const response = await apiClient.post<
    ApiResponse<VerifyVerificationCodeSuccessData>
  >("/auth/verify", data);
  return handleApiResponse(response, "이메일 인증에 실패했습니다.");
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
  return handleApiResponse(response, "비밀번호 재설정 요청에 실패했습니다.");
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
  return handleApiResponse(response, "비밀번호 재설정에 실패했습니다.");
};

/**
 * 로그아웃 API
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

/**
 * 비밀번호 변경 API
 * @param data { currentPassword: string, newPassword: string }
 * @returns 성공 시 메시지(string)
 * 추가 - 이삭
 */
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<string> => {
  const response = await apiClient.patch<ApiResponse<string>>(
    "/auth/change-passwd",
    data,
    { withCredentials: true },
  );
  const apiResponse = response.data;
  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(
      apiResponse.error?.reason || "비밀번호 변경에 실패했습니다.",
    );
  }
  return apiResponse.success;
};

//* 현재 로그인된 유저 정보 조회
// * 추가 - 이삭
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(`/profile/me`);
  return handleApiResponse(response, "유저 조회에 실패했습니다.");
};
