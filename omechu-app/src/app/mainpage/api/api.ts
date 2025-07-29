import {
  restaurantList,
  RestaurantRequest,
} from "@/constant/mainpage/RestaurantData";
import {
  MenuListResponse,
  RecommendMenuRequest,
} from "@/constant/mainpage/resultData";
import apiClient from "@/lib/api/client";

export const getRecommendMenu = async (
  request: RecommendMenuRequest,
): Promise<MenuListResponse> => {
  // POST 로 body 에 실어서 보내기
  const { data } = await apiClient.post<MenuListResponse>(
    "/recommend",
    request,
  );
  return data;
};

export const getRestaurants = async (
  request: RestaurantRequest,
): Promise<restaurantList> => {
  const { data } = await apiClient.post<restaurantList>(
    "/fetch-google-places",
    request,
  );

  return data;
};
