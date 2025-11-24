import {
  Restaurant,
  restaurantList,
  RestaurantRequest,
} from "@/constant/mainpage/RestaurantData";
import { useQuery } from "@tanstack/react-query";
import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";
import { getRestaurants } from "../api/getRestaurants";

function useGetRestaurants() {
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

export default useGetRestaurants;
