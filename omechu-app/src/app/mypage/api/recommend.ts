// src/app/mypage/api/recommend.ts

import axiosInstance from "@/lib/api/axios";
import { useAuthStore } from "@/lib/stores/auth.store";
import type { ApiResponse } from "@/lib/api/auth";

/** 서버 원형 타입 (Swagger 기준) */
type RecommendMenuRaw = {
  id: string; // 서버는 문자열
  name: string | null;
  image_link: string | null;
};

type RecommendSummaryRaw = {
  totalMenus: number;
  recommendMenus: number;
  exceptedMenus: number;
};

type RecommendManagementSuccessRaw = {
  summary: RecommendSummaryRaw;
  recommendMenus: RecommendMenuRaw[];
  exceptedMenus: RecommendMenuRaw[];
};

/** 클라이언트에서 쓰기 편한 정규화 타입 */
export type RecommendMenu = {
  id: number; // number로 변환
  name: string; // 빈 문자열로 보정
  imageUrl: string; // null → ""
};

export type RecommendSummary = {
  totalMenus: number;
  recommendMenus: number;
  exceptedMenus: number;
};

export type RecommendManagementData = {
  summary: RecommendSummary;
  recommendMenus: RecommendMenu[];
  exceptedMenus: RecommendMenu[];
};

/** 응답 전체 타입 */
export type FetchRecommendManagementResponse =
  ApiResponse<RecommendManagementData>;

/** 내부 정규화 유틸 */
function normalizeMenu(raw: RecommendMenuRaw): RecommendMenu {
  return {
    id: Number(raw.id),
    name: raw.name ?? "",
    imageUrl: raw.image_link ?? "",
  };
}

function normalizeSuccess(
  raw: RecommendManagementSuccessRaw,
): RecommendManagementData {
  return {
    summary: {
      totalMenus: raw.summary.totalMenus ?? 0,
      recommendMenus: raw.summary.recommendMenus ?? 0,
      exceptedMenus: raw.summary.exceptedMenus ?? 0,
    },
    recommendMenus: (raw.recommendMenus ?? []).map(normalizeMenu),
    exceptedMenus: (raw.exceptedMenus ?? []).map(normalizeMenu),
  };
}

/**
 * 추천목록 관리 데이터 조회
 * - GET /recommend/management
 * - 인터셉터가 불안하면 Authorization 헤더를 명시적으로 붙임
 */
export async function fetchRecommendManagement(): Promise<FetchRecommendManagementResponse> {
  const accessToken = useAuthStore.getState().user?.accessToken;
  if (!accessToken) {
    throw new Error("No access token. Please login first.");
  }

  const res = await axiosInstance.get<
    ApiResponse<RecommendManagementSuccessRaw>
  >("/recommend/management", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // FAIL 처리
  if (res.data.resultType === "FAIL" || !res.data.success) {
    throw new Error(
      res.data.error?.reason || "추천목록을 불러오지 못했습니다.",
    );
  }

  // 성공 데이터 정규화해서 success에 재포장
  const normalized = normalizeSuccess(res.data.success);
  return {
    ...res.data,
    success: normalized,
  };
}
