import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { ApiResponse } from "@/entities/user/api/authApi";

/**
 * 온보딩 완료(회원 정보 완료) 요청 데이터 타입
 * - 백엔드 컨트롤러는 한국어 값을 받아 내부에서 enum으로 변환합니다.
 */
export interface OnboardingRequestData {
  nickname: string;
  profileImageUrl?: string;
  gender: "남성" | "여성" | null;
  body_type: "감기" | "소화불량" | "더위잘탐" | "추위잘탐" | null;
  exercise: "다이어트 중" | "증량 중" | "유지 중" | null;
  prefer: string[]; // 예: ["한식", "양식"]
  allergy: string[]; // 예: ["달걀(난류) 알레르기", ...]
}

/**
 * 온보딩 완료(회원가입 완료) API 성공 응답 데이터 타입
 */
export interface OnboardingSuccessData {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  gender: "남성" | "여성" | null;
  body_type: "감기" | "소화불량" | "더위잘탐" | "추위잘탐" | null;
  exercise: "다이어트 중" | "증량 중" | "유지 중" | null;
  prefer: string[];
  allergy: string[];
  created_at: string;
  updated_at: string;
}

/**
 * 온보딩 데이터를 서버에 전송하는 API 함수
 */
export const completeOnboarding = async (
  data: OnboardingRequestData,
): Promise<OnboardingSuccessData> => {
  // `handleUpdateUserInfo` 컨트롤러가 /auth/complete 엔드포인트에 연결되어 있다고 가정
  const response = await axiosInstance.patch<
    ApiResponse<OnboardingSuccessData>
  >("/auth/complete", data);

  const apiResponse = response.data;

  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(apiResponse.error?.reason || "정보 저장에 실패했습니다.");
  }

  return apiResponse.success;
};
