import { axiosInstance } from "@/shared";
import type {
  RestaurantListResponse,
  RestaurantRequest,
} from "@/entities/restaurant/config/RestaurantData";

export const getRestaurants = async (
  request: RestaurantRequest,
): Promise<RestaurantListResponse> => {
  const { data } = await axiosInstance.post<RestaurantListResponse>(
    "/menu/fetch-google-places",
    request,
  );

  return data;
};
