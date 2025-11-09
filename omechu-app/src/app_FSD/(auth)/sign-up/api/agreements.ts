import axios from "axios";
import axiosInstance from "@/lib/api/axios";
import type { ApiResponse } from "@/entities_FSD/user/api/authApi";
import { ApiClientError } from "@/entities_FSD/user/api/authApi";

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
  try {
    const res = await axiosInstance.post<ApiResponse<AgreementConsentSuccess>>(
      "/agreements/consent",
      body,
    );
    const data = res.data;
    if (data.resultType === "FAIL" || !data.success) {
      throw new ApiClientError(
        data.error?.reason || "약관 동의 요청에 실패했습니다.",
        data.error?.errorCode,
        res.status,
        data.error?.data,
      );
    }
    return data.success;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const api = err.response?.data as ApiResponse<unknown> | undefined;
      throw new ApiClientError(
        api?.error?.reason || err.message || "약관 동의 요청에 실패했습니다.",
        api?.error?.errorCode,
        err.response?.status,
        api?.error?.data,
      );
    }
    throw new ApiClientError(
      "네트워크 오류가 발생했습니다. 다시 시도해 주세요.",
    );
  }
};
