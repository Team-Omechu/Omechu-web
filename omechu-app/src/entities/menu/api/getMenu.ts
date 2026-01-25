import { axiosInstance } from "@/shared";
import {
  MenuListResponse,
  RecommendMenuRequest,
} from "@/entities/menu/config/resultData";

export const getMenu = async (
  request: RecommendMenuRequest,
): Promise<MenuListResponse> => {
  // POST 로 body 에 실어서 보내기
  const { data } = await axiosInstance.post<MenuListResponse>(
    "/recommend/menu",
    request,
  );
  return data;
};
