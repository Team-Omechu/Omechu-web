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
