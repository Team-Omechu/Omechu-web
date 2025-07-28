import { Restaurant, restaurantList, RestaurantRequest } from "@/constant/mainpage/RestaurantData"
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "../api/api";
import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";

function useGetRestaurants() {
    const {x,y,radius,keyword} = useLocationAnswerStore();

    const payload: RestaurantRequest = {
        latitude: x,
        longitude: y,
        radius,
        keyword,
        pageSize: 3
    };
    return useQuery<Restaurant[]>({
        queryKey:["Restaurants"],
        queryFn: () => getRestaurants(payload),
        staleTime: 1000 * 60 * 5,
    });
}

export default useGetRestaurants