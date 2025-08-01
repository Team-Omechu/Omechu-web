import type { AxiosResponse } from "axios";
// 경로 수정: @가 src/app을 가리키므로, 상위 폴더로 나가서 참조합니다.
import type {
  LoginFormValues,
  SignupFormValues,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";
import apiClient from "./client";

// --- API 타입 정의 (기존 코드와 동일) ---
export interface ApiResponse<T> {
  resultType: "SUCCESS" | "FAIL";
  error: ApiError | null;
  success: T | null;
}
export interface ApiError {
  errorCode: string;
  reason: string;
  data?: unknown;
}
export interface LoginSuccessData {
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
export interface SignupSuccessData {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}
export interface SendVerificationCodeSuccessData {
  message: string;
  code: string;
}
export interface VerifyVerificationCodeParams {
  email: string;
  code: string;
}
export interface VerifyVerificationCodeSuccessData {
  message: string;
}
export interface RequestPasswordResetSuccessData {
  message: string;
  token: string;
}
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

// --- API 함수 정의 ---

/**
 * 로그인 API (프록시 경유)
 */
export const login = async (
  data: LoginFormValues,
): Promise<LoginSuccessData> => {
  const response = await apiClient.post<ApiResponse<LoginSuccessData>>(
    "/api/auth/login", // client.ts가 이 경로를 보고 내부 프록시로 보냅니다.
    data,
  );
  return handleApiResponse(response, "로그인에 실패했습니다.");
};

/**
 * 로그아웃 API (프록시 경유)
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/api/auth/logout"); // client.ts가 이 경로를 보고 내부 프록시로 보냅니다.
};

// --- 아래 함수들은 프록시가 필요 없으므로 기존 로직을 유지합니다 ---

export const signup = async (
  data: SignupFormValues,
): Promise<SignupSuccessData> => {
  const { email, password } = data;
  // 이 경로는 '/api/'로 시작하지 않으므로, client.ts가 외부 API로 보냅니다.
  const response = await apiClient.post<ApiResponse<SignupSuccessData>>(
    "/auth/signup",
    { email, password },
  );
  return handleApiResponse(response, "회원가입에 실패했습니다.");
};

export const completeOnboarding = async (
  data: OnboardingData,
): Promise<LoginSuccessData> => {
  const response = await apiClient.patch<ApiResponse<LoginSuccessData>>(
    "/auth/complete",
    data,
  );
  return handleApiResponse(response, "온보딩 정보 저장에 실패했습니다.");
};

export const sendVerificationCode = async (
  email: string,
): Promise<SendVerificationCodeSuccessData> => {
  const response = await apiClient.post<
    ApiResponse<SendVerificationCodeSuccessData>
  >("/auth/send", { email });
  return handleApiResponse(response, "인증번호 전송에 실패했습니다.");
};

export const verifyVerificationCode = async (
  data: VerifyVerificationCodeParams,
): Promise<VerifyVerificationCodeSuccessData> => {
  const response = await apiClient.post<
    ApiResponse<VerifyVerificationCodeSuccessData>
  >("/auth/verify", data);
  return handleApiResponse(response, "이메일 인증에 실패했습니다.");
};

export const requestPasswordReset = async (
  data: FindPasswordFormValues,
): Promise<RequestPasswordResetSuccessData> => {
  const response = await apiClient.post<
    ApiResponse<RequestPasswordResetSuccessData>
  >("/auth/reset-request", data);
  return handleApiResponse(response, "비밀번호 재설정 요청에 실패했습니다.");
};

export const resetPassword = async (
  data: ResetPasswordFormValues,
): Promise<string> => {
  const response = await apiClient.patch<ApiResponse<string>>("/auth/passwd", {
    newPassword: data.password,
  });
  return handleApiResponse(response, "비밀번호 재설정에 실패했습니다.");
};

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

export const getCurrentUser = async (): Promise<LoginSuccessData> => {
  const response =
    await apiClient.get<ApiResponse<LoginSuccessData>>(`/profile/me`);
  return handleApiResponse(response, "유저 조회에 실패했습니다.");
};
