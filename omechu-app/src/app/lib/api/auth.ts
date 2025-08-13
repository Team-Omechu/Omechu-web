import type {
  LoginFormValues,
  SignupFormValues,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";
import axiosInstance from "@/lib/api/axios";
import { useAuthStore } from "@/lib/stores/auth.store";

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

export interface LoginTokens {
  userId: string;
  accessToken: string;
  refreshToken: string;
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

// 이메일 인증번호 검증 성공 시 success 객체 구조
export interface VerifyVerificationCodeSuccessData {
  message: string;
}

// 비밀번호 재설정 요청 성공 시 success 객체 구조
export interface RequestPasswordResetSuccessData {
  message: string;
  token: string;
}

// (중복 제거) 온보딩 타입 및 API는 `onboarding/api/onboarding.ts`에서 관리합니다.

// 내부 유틸: store/localStorage 어디에 저장됐든 accessToken 읽기
const readAccessToken = (): string | null => {
  // 1) 우선 zustand store에서 시도
  const fromStore = useAuthStore.getState().accessToken;
  if (fromStore) return fromStore;

  // 2) 과거/현재 키들을 순회하며 로컬스토리지에서 탐색
  try {
    const candidateKeys = ["auth-storage", "auth-store", "auth-user-storage"];
    for (const key of candidateKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.accessToken ?? null;
      if (token) return token;
    }
  } catch (e) {
    console.warn("[AUTH] readAccessToken localStorage parse error:", e);
  }
  return null;
};

/**
 * 로그인 API
 * @param data email, password
 */
export const login = async (data: LoginFormValues): Promise<LoginTokens> => {
  const response = await axiosInstance.post<ApiResponse<LoginTokens>>(
    "/auth/login",
    data,
    { withCredentials: true },
  );

  const apiResponse = response.data;

  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    // resultType이 FAIL이거나 success 필드가 없을 경우, 에러를 발생시켜
    // TanStack Query의 onError 콜백을 트리거합니다.
    throw new Error(apiResponse.error?.reason || "로그인에 실패했습니다.");
  }

  return apiResponse.success as LoginTokens;
};

/**
 * 회원가입 API
 * @param data email, password 등 회원가입 정보
 */
export const signup = async (
  data: SignupFormValues,
): Promise<SignupSuccessData> => {
  const { email, password } = data;
  const response = await axiosInstance.post<ApiResponse<SignupSuccessData>>(
    "/auth/signup",
    { email, password },
  );
  const apiResponse = response.data;
  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(apiResponse.error?.reason || "회원가입에 실패했습니다.");
  }
  return apiResponse.success;
};

// (삭제) completeOnboarding는 `onboarding/api/onboarding.ts` 사용

/**
 * 이메일 인증번호 전송 API
 * @param email
 */
export const sendVerificationCode = async (
  email: string,
): Promise<SendVerificationCodeSuccessData> => {
  const response = await axiosInstance.post<
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
  const response = await axiosInstance.post<
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
  const response = await axiosInstance.post<
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
  data: ResetPasswordFormValues & { token: string },
): Promise<string> => {
  const response = await axiosInstance.patch<ApiResponse<string>>(
    `/reset-passwd?token=${encodeURIComponent(data.token)}`,
    { newPassword: data.password },
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
  await axiosInstance.post(
    "/auth/logout",
    {},
    {
      // Authorization 헤더는 axiosInstance의 요청 인터셉터에서
      // accessToken을 자동으로 주입합니다.
      withCredentials: true,
    },
  );
  useAuthStore.getState().logout();
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
  const accessToken = readAccessToken();
  if (!accessToken) {
    throw new Error("accessToken이 없습니다. 먼저 로그인 해주세요.");
  }

  console.log("[DEBUG] changePassword 호출");
  console.log("[DEBUG] Token(head 12):", accessToken.slice(0, 12));
  console.log("[DEBUG] Request Body:", data);

  const response = await axiosInstance.patch<ApiResponse<string>>(
    "/auth/change-passwd",
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const apiResponse = response.data;
  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(
      apiResponse.error?.reason || "비밀번호 변경에 실패했습니다.",
    );
  }
  return apiResponse.success;
};

// 현재 로그인된 유저 정보 조회 (accessToken을 명시적으로 붙임)
export const getCurrentUser = async (): Promise<LoginSuccessData> => {
  // zustand store와 localStorage를 모두 고려하여 accessToken 읽기
  const accessToken = readAccessToken();
  if (!accessToken) {
    throw new Error("accessToken이 없습니다. 먼저 로그인 해주세요.");
  }

  const response = await axiosInstance.get<ApiResponse<LoginSuccessData>>(
    "/profile",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const apiResponse = response.data;
  if (apiResponse.resultType === "FAIL" || !apiResponse.success) {
    throw new Error(apiResponse.error?.reason || "유저 조회 실패");
  }

  return apiResponse.success;
};
