import apiClient from "@/lib/api/client"; // axios 인스턴스 예시

// 타입은 API 명세와 맞춰서 필요시 추가
export interface RestaurantItem {
  id: number;
  name: string;
  address?: string;
  rating?: number;
  // images?: string[]; // 추후 API에서 제공되면 반영
}

export interface FetchRestaurantsResponse {
  resultType: string;
  error: null | any;
  success: {
    data: RestaurantItem[];
  };
}

export async function fetchRestaurants(
  userId: string,
): Promise<FetchRestaurantsResponse> {
  const res = await apiClient.get<FetchRestaurantsResponse>(
    `/restaurants/${userId}`,
  );
  return res.data;
}
