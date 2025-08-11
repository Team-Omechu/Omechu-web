// src/app/mypage/api/favorites.ts
import axiosInstance from "@/lib/api/axios"; // 너가 만든 axios 인스턴스
import { useAuthStore } from "@/auth/store";
import axios from "axios";

const authHeader = () => {
  const token = useAuthStore.getState().user?.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 찜 목록 조회
export async function fetchHeartList() {
  const { data } = await axiosInstance.get("/hearts", {
    headers: authHeader(),
  });
  // 서버 공통 응답 껍질 제거
  if (data.resultType === "FAIL" || !data.success) {
    throw new Error(data.error?.reason ?? "찜 목록 조회 실패");
  }
  return data.success.data ?? [];
}

// 찜 등록
export async function likePlace(restaurantId: number) {
  try {
    const { data } = await axiosInstance.post(
      "/heart",
      { restaurantId },
      { headers: authHeader() },
    );
    if (data.resultType === "FAIL" || !data.success) {
      throw new Error(data.error?.reason ?? "찜 등록 실패");
    }
    return data.success;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const msg = err.response.data?.error?.reason ?? "";
      const status = err.response.status;

      if (status === 409 || /duplicate|already|exists|이미/i.test(msg)) {
        return { already: true };
      }
    }
    throw err;
  }
}

// 찜 해제
export async function unlikePlace(restaurantId: number) {
  const { data } = await axiosInstance.delete("/heart", {
    headers: authHeader(),
    data: { restaurantId },
  });
  if (data.resultType === "FAIL" || !data.success) {
    throw new Error(data.error?.reason ?? "찜 해제 실패");
  }
  return data.success;
}
