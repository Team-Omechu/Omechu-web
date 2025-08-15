import { HeartResponse } from "@/constant/mainpage/likeList";
import { mukburimResponse } from "@/constant/mainpage/mukburim";
import { ProfileResponse } from "@/constant/mainpage/profile";
import {
  restaurantList,
  RestaurantRequest,
} from "@/constant/mainpage/RestaurantData";
import {
  MenuListResponse,
  RandomMenu,
  RandomMenuRequest,
  RecommendMenuRequest,
} from "@/constant/mainpage/resultData";
import axiosInstance from "@/lib/api/axios";
import { MenuDetail } from "@/lib/types/menu";

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

export const getRandomMenu = async (
  request: RandomMenuRequest,
): Promise<RandomMenu> => {
  // POST 로 body 에 실어서 보내기
  const { data } = await axiosInstance.post<RandomMenu>(
    "/recommend/random",
    request,
  );
  return data;
};

export const getMenuDetail = async (
  name: string,
  opts?: { signal?: AbortSignal },
): Promise<MenuDetail> => {
  if (!name) throw new Error("menu name is required");

  const res = await axiosInstance.post<MenuDetail>(
    "/menu-info",
    { name: name.trim() },
    {
      headers: { "Content-Type": "application/json" },
      signal: opts?.signal,
    },
  );
  return res.data;
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

export const getMyHeartsIds = async (): Promise<number[]> => {
  const { data } = await axiosInstance.get<HeartResponse>("/hearts");
  const list = data?.success?.data ?? [];
  // restaurantId가 문자열이므로 number로 변환 + 유효성 필터 + 중복 제거
  const ids = Array.from(
    new Set(
      list
        .map((it) => Number(it.restaurantId))
        .filter((n) => Number.isFinite(n)),
    ),
  );
  return ids;
};
