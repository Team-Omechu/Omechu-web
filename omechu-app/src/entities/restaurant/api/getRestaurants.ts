import { axiosInstance } from "@/shared";
import { restaurantList, RestaurantRequest } from "@/entities/restaurant/config/RestaurantData";

export const getRestaurants = async (
  request: RestaurantRequest,
): Promise<restaurantList> => {
  const { data } = await axiosInstance.post<restaurantList>(
    "/fetch-google-places",
    request,
  );

  return data;
};
