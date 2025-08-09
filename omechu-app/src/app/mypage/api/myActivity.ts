import { ApiResponse } from "@/lib/api/auth";
import axiosInstance from "@/lib/api/axios";
import { useAuthStore } from "@/lib/stores/auth.store";

export interface MyPlaceItem {
  id: number;
  name: string;
  rest_image?: string;
  address?: string;
  rating?: number;
  repre_menu?: { menu: string }[];
  _count?: { review: number };
}

export interface FetchMyPlaceResponse {
  resultType: string;
  error: null | any;
  success: {
    data: MyPlaceItem[];
    hasNextPage?: boolean;
    nextCursor?: string | null;
  };
}

export interface MyReviewItem {
  id: number;
  user_id: number;
  rest_id: number;
  rating: number;
  tag: string[];
  text: string;
  created_at: string;
  like: number;
  restaurant: {
    id: number;
    rest_image: string;
    location: string;
    name: string;
    address: string;
    rating: number;
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
    google_place_id?: string | null;
    representativeMenus?: string[];
    tags?: { tag: string; count: number }[];
  };
  reviewImages?: string[];
}

export interface FetchMyReviewsResponse {
  resultType: string;
  error: null | any;
  success: {
    data: MyReviewItem[];
    hasNextPage?: boolean;
    nextCursor?: number | null;
  };
}

export async function fetchMyReviews(): Promise<FetchMyReviewsResponse> {
  const accessToken = useAuthStore.getState().user?.accessToken;
  if (!accessToken) {
    throw new Error("No access token found. User might not be authenticated.");
  }
  const res = await axiosInstance.get<FetchMyReviewsResponse>("/reviews", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  console.log("[DEBUG] 내 리뷰 응답:", res.data);
  const fixedData = res.data.success.data.map((item) => ({
    ...item,
    id: Number(item.id),
    user_id: Number(item.user_id),
    rest_id: Number(item.rest_id),
    restaurant: {
      ...item.restaurant,
      id: Number(item.restaurant.id),
      // 대표메뉴/태그 등은 그대로 사용, 필요시 추가 가공
      representativeMenus: item.restaurant.representativeMenus ?? [],
      tags: item.restaurant.tags ?? [],
    },
    reviewImages: item.reviewImages ?? [],
  }));
  return {
    ...res.data,
    success: {
      ...res.data.success,
      data: fixedData,
    },
  };
}

// limit, cursor 등 옵션 파라미터 필요시 추가
export async function fetchMyPlaces(
  limit = 10,
  cursor?: number | string,
): Promise<FetchMyPlaceResponse> {
  const accessToken = useAuthStore.getState().user?.accessToken;
  if (!accessToken) throw new Error("No access token. Please login first.");

  let query = `?limit=${limit}`;
  if (cursor !== undefined && cursor !== null) query += `&cursor=${cursor}`;

  const res = await axiosInstance.get<FetchMyPlaceResponse>(
    `/profile/myPlace${query}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const raw = res.data;
  const fixed = raw.success.data.map((item) => ({
    id: Number(item.id),
    name: item.name,
    rating: Number(item.rating ?? 0),
    repre_menu: item.repre_menu ?? [],
    _count: item._count ?? { review: 0 },
    rest_image: item.rest_image,
    address: item.address,
  }));
  return {
    ...raw,
    success: {
      ...raw.success,
      data: fixed,
    },
  };
}

// 리뷰 좋아요/취소
export async function toggleReviewLike(
  restId: number,
  reviewId: number,
  like: boolean,
) {
  const accessToken = useAuthStore.getState().user?.accessToken;
  if (!accessToken) {
    throw new Error("No access token. Please login first.");
  }
  const res = await axiosInstance.patch<
    ApiResponse<{ reviewId: string; restId: string }>
  >(
    `/place/${restId}/like/${reviewId}`,
    { like },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (res.data.resultType === "FAIL") {
    throw new Error(res.data.error?.reason || "리뷰 좋아요 변경 실패");
  }
  return res.data.success;
}
