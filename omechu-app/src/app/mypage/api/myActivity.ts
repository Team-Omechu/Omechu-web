import apiClient from "@/lib/api/client";

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
