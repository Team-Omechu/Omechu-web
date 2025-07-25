import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/auth/api/auth";

/**
 * 온보딩 완료(회원가입 완료) API 요청 데이터 타입
 * - 백엔드 user.dto.js 명세에 따라 최종 수정
 */
export interface OnboardingRequestData {
  nickname: string;
  profileImageUrl: string;
  gender: "남자" | "여자" | null;
  body_type: string | null;
  state: string | null;
  prefer: string[];
  allergy: string[];
}

/**
 * 온보딩 완료(회원가입 완료) API 성공 응답 데이터 타입
 */
export interface OnboardingSuccessData {
  email: string;
  nickname: string;
  profileImageUrl: string;
  gender: "남성" | "여성";
  body_type: string;
  state: string;
  prefer: string[];
  allergy: string[];
}

/**
 * 온보딩 데이터를 서버에 전송하는 API 함수
 */
export const completeOnboarding = async (
  data: OnboardingRequestData,
): Promise<OnboardingSuccessData> => {
  // `handleUpdateUserInfo` 컨트롤러가 /auth/complete 엔드포인트에 연결되어 있다고 가정
  const response = await apiClient.patch<ApiResponse<OnboardingSuccessData>>(
    "/auth/complete",
    data,
  );

  const apiResponse = response.data;

  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(apiResponse.error?.reason || "정보 저장에 실패했습니다.");
  }

  return apiResponse.success;
};
