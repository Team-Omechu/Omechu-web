import { mukburimResponse } from "@/constant/mainpage/mukburim";
import { ProfileResponse } from "@/constant/mainpage/profile";
import {
  restaurantList,
  RestaurantRequest,
} from "@/constant/mainpage/RestaurantData";
import {
  MenuDetail,
  MenuListResponse,
  RandomMenu,
  RandomMenuRequest,
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

export const getRandomMenu = async (request: RandomMenuRequest):Promise<RandomMenu>=> {
  // POST 로 body 에 실어서 보내기
  const { data } = await axiosInstance.post<RandomMenu>(
    "/recommend/random",
    request,
  );
  return data;
}
  
export const getMenuDetail = async (
  name: string,
  opts?: { signal?: AbortSignal }
): Promise<MenuDetail> => {
  if (!name) throw new Error("menu name is required");

  const res = await axiosInstance.post<MenuDetail>(
    "/menu-info",
    { name: name.trim() },                       // Swagger 스펙 그대로
    {
      headers: { "Content-Type": "application/json" }, // 인스턴스 기본값 무시하고 강제
      withCredentials: true,                             // 필요 없으면 제거
      signal: opts?.signal,
    }
  );
  return res.data; // 서버가 {data: …}로 감싸면 언래핑 필요
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
