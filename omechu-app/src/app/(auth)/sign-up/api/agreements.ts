import axiosInstance from "@/lib/api/axios";
import type { ApiResponse } from "@/lib/api/auth";

export interface AgreementConsentBody {
  agreeAll: boolean;
  termsOfService: boolean;
  privacyPolicy: boolean;
  locationService: boolean;
  isOver14: boolean;
}

export interface AgreementConsentSuccess {
  message: string;
}

// 로그인(Authorization 필요) 상태에서 호출되어야 함
export const agreeToTerms = async (
  body: AgreementConsentBody,
): Promise<AgreementConsentSuccess> => {
  const res = await axiosInstance.post<ApiResponse<AgreementConsentSuccess>>(
    "/agreements/consent",
    body,
  );
  const data = res.data;
  if (data.resultType === "FAIL" || !data.success) {
    throw new Error(data.error?.reason || "약관 동의 요청에 실패했습니다.");
  }
  return data.success;
};
