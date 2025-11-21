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

/**
 * Callers should consume normalized data directly.
 * Removed alias FetchRecommendManagementResponse.
 */

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

// * 추천목록 관리 데이터 조회
// * - GET /recommend/management
export async function fetchRecommendManagement(): Promise<RecommendManagementData> {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) {
    throw new Error("No access token. Please login first.");
  }

  const res = await axiosInstance.get<
    ApiResponse<RecommendManagementSuccessRaw>
  >("/recommend/management", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.data.resultType === "FAIL" || !res.data.success) {
    throw new Error(
      res.data.error?.reason || "추천목록을 불러오지 못했습니다.",
    );
  }

  // 정규화된 데이터만 반환 (클라이언트 사용성을 위해)
  return normalizeSuccess(res.data.success);
}

// * 추천목록에서 제외 목록으로 추가
// * - POST /recommend/except
// This function returns the inner success payload directly
export async function exceptMenu(params: {
  menuId?: number;
  menuName?: string;
}) {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) {
    throw new Error("No access token. Please login first.");
  }

  const body =
    typeof params.menuId === "number"
      ? { menuId: params.menuId }
      : { menuName: params.menuName };

  const res = await axiosInstance.post("/recommend/except", body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.data.resultType === "FAIL" || !res.data.success) {
    throw new Error(res.data.error?.reason || "제외 목록 추가 실패");
  }

  return res.data.success;
}

// * 제외 목록에서 제거 (다시 추천 받도록 설정)
// * - POST /recommend/except/remove
// This function returns the inner success payload directly
export type RemoveExceptResult = {
  success: boolean;
  message: string;
};

export async function removeExceptMenu(params: {
  menuId?: number;
  menuName?: string;
}): Promise<RemoveExceptResult> {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) {
    throw new Error("No access token. Please login first.");
  }

  const body =
    typeof params.menuId === "number"
      ? { menuId: params.menuId }
      : { menuName: params.menuName };

  const res = await axiosInstance.post("/recommend/except/remove", body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.data.resultType === "FAIL" || !res.data.success) {
    throw new Error(
      res.data.error?.reason || "제외 목록에서 제거에 실패했습니다.",
    );
  }

  // 서버 응답은 { success: { success: boolean, message: string } } 형태
  return res.data.success as RemoveExceptResult;
}
