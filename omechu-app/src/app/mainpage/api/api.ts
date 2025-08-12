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

export const getMenuDetail = async (menu_name:string):Promise<MenuListResponse> => {
  const { data } = await axiosInstance.post<MenuListResponse>(
    "/menu-info",
     menu_name);
  return data;
}

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

export const addHeart = async (restaurantId?: number) => {
  const response = await axiosInstance.post("/heart", {
    restaurantId: restaurantId,
  });
  if (response.status !== 200) {
    throw new Error("Failed to add heart");
  }
  return response;
};

export const deleteHeart = async (restaurantId?: number) => {
  const response = await axiosInstance.delete("/heart", {
    data: {
      restaurantId: restaurantId,
    },
  });
  if (response.status !== 200) {
    throw new Error("Failed to delete heart");
  }
  return response;
};
