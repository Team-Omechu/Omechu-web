import apiClient from "@/lib/api/client";

export interface MyPlaceItem {
  id: number;
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

export async function fetchMyReviews(
  userId: number,
): Promise<FetchMyReviewsResponse> {
  const res = await apiClient.get<FetchMyReviewsResponse>(`/reviews/${userId}`);
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
  cursor?: number,
): Promise<FetchMyPlaceResponse> {
  // query string 조립
  let query = `?limit=${limit}`;
  if (cursor !== undefined) query += `&cursor=${cursor}`;
  const res = await apiClient.get<FetchMyPlaceResponse>(
    `/profile/myPlace${query}`,
  );
  return res.data;
}
