// src/app/mypage/api/favorites.ts
import axios from "axios";

import { useAuthStore } from "@/entities/user/model/auth.store";
import { axiosInstance } from "@/shared/lib/axiosInstance"; // 공통 axios 인스턴스

/** 공통 응답 스펙 */
interface ApiSuccess<T = unknown> {
  resultType: "SUCCESS";
  success: { data?: T } & Record<string, unknown>;
  error: null;
}
interface ApiFail {
  resultType: "FAIL";
  success: null;
  error: { reason?: string } | null;
}

type ApiResponse<T = unknown> = ApiSuccess<T> | ApiFail | any;

const getToken = () => useAuthStore.getState().accessToken;
const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ensureAuth = () => {
  const token = getToken();
  if (!token) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err; // 호출부에서 /sign-in 등으로 라우팅 처리
  }
};

function unwrapOrThrow<T>(
  data: ApiResponse<T>,
  defaultVal: T,
  failMsg = "요청 실패",
) {
  if (!data) throw new Error(failMsg);
  if (data.resultType === "FAIL" || !data.success) {
    throw new Error(data?.error?.reason ?? failMsg);
  }
  // 일부 API는 success.data 없이 success만 반환
  return (data.success?.data ?? defaultVal) as T;
}

// =====================
// 찜 목록 조회
// =====================
export async function fetchHeartList<T = any[]>() {
  ensureAuth();
  const { data } = await axiosInstance.get<ApiResponse<T>>("/hearts", {
    headers: authHeader(),
  });
  return unwrapOrThrow<T>(data, [] as unknown as T, "찜 목록 조회 실패");
}

// =====================
// 찜 등록
// =====================
export async function likePlace(restaurantId: number) {
  ensureAuth();
  if (!Number.isFinite(restaurantId))
    throw new Error("유효하지 않은 restaurantId");

  try {
    const { data } = await axiosInstance.post<ApiResponse>(
      "/heart",
      { restaurantId },
      { headers: authHeader() },
    );
    // 성공시 data가 없을 수 있어 통일된 반환
    unwrapOrThrow(data, null, "찜 등록 실패");
    return { ok: true as const };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const msg = (err.response.data as any)?.error?.reason ?? "";
      const status = err.response.status;
      // 이미 찜 상태(중복)인 경우를 소프트 성공으로 처리
      if (status === 409 || /duplicate|already|exists|이미/i.test(msg)) {
        return { already: true as const };
      }
    }
    throw err;
  }
}

// =====================
// 찜 해제
// =====================
export async function unlikePlace(restaurantId: number) {
  ensureAuth();
  if (!Number.isFinite(restaurantId))
    throw new Error("유효하지 않은 restaurantId");

  try {
    const { data } = await axiosInstance.delete<ApiResponse>("/heart", {
      headers: authHeader(),
      data: { restaurantId },
    });
    unwrapOrThrow(data, null, "찜 해제 실패");
    return { ok: true as const };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      // 이미 해제된 상태(리소스 없음)를 소프트 성공으로 간주
      if (status === 404) {
        return { alreadyRemoved: true as const };
      }
    }
    throw err;
  }
}
