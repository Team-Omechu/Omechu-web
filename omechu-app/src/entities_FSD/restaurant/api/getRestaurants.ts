import { axiosInstance } from "@/shared_FSD/index";
import { restaurantList, RestaurantRequest } from "../config/RestaurantData";

export const getRestaurants = async (
  request: RestaurantRequest,
): Promise<restaurantList> => {
  const { data } = await axiosInstance.post<restaurantList>(
    "/fetch-google-places",
    request,
  );

  return data;
};
