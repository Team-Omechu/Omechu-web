import { useLocationAnswerStore } from "@/entities/location";
import { useQuery } from "@tanstack/react-query";
import {
  restaurantList,
  RestaurantRequest,
} from "@/entities/restaurant/config/RestaurantData";
import { getRestaurants } from "@/entities/restaurant/api/getRestaurants";

export function useGetRestaurants() {
  const { x, y, radius, keyword } = useLocationAnswerStore();

  const payload: RestaurantRequest = {
    latitude: x,
    longitude: y,
    radius,
    keyword,
    pageSize: 3,
  };
  return useQuery<restaurantList>({
    queryKey: ["Restaurants", payload],
    queryFn: () => getRestaurants(payload),
    staleTime: 1000 * 60 * 5,
  });
}
