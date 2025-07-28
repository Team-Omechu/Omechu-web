import type { LoginFormValues } from "@/auth/schemas/auth.schema";
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

// 로그인 성공 시 success 객체 구조
export interface LoginSuccessData {
  id: string;
  email: string;
  gender: "남성" | "여성";
  nickname: string;
  created_at: string;
  updated_at: string;
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

// * 로그아웃 API
// * 추가 - 이삭
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
