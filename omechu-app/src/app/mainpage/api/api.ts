import { mukburimResponse } from "@/constant/mainpage/mukburim";
import { ProfileResponse } from "@/constant/mainpage/profile";
import {
  restaurantList,
  RestaurantRequest,
} from "@/constant/mainpage/RestaurantData";
import {
  MenuListResponse,
  RecommendMenuRequest,
} from "@/constant/mainpage/resultData";
import axiosInstance from "@/lib/api/axios";

export const getRecommendMenu = async (
  request: RecommendMenuRequest,
): Promise<MenuListResponse> => {
  // POST 로 body 에 실어서 보내기
  const { data } = await axiosInstance.post<MenuListResponse>(
    "/recommend",
    request,
  );
  return data;
};

export const getRestaurants = async (
  request: RestaurantRequest,
): Promise<restaurantList> => {
  const { data } = await axiosInstance.post<restaurantList>(
    "/fetch-google-places",
    request,
  );

  return data;
};

export const getProfile = async (): Promise<ProfileResponse> => {
  const { data } = await axiosInstance.get<ProfileResponse>("/profile");
  return data;
};

export const postMukburim = async (
  menuName: string,
): Promise<mukburimResponse> => {
  const { data } = await axiosInstance.post<mukburimResponse>("/mukburim", {
    menu_name: menuName,
  });
  return data;
};

export const addHeart = async (userId?: number, restaurantId?: number) => {
  const response = await axiosInstance.post("/heart", {
    userId: userId,
    restaurantId: restaurantId,
  });
  if (response.status !== 200) {
    throw new Error("Failed to add heart");
  }
  return response;
};

export const deleteHeart = async (userId?: number, restaurantId?: number) => {
  const response = await axiosInstance.delete("/heart", {
    data: {
      userId: userId,
      restaurantId: restaurantId,
    },
  });
  if (response.status !== 200) {
    throw new Error("Failed to delete heart");
  }
  return response;
};
