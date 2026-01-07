import { axiosInstance } from "../../../shared/index";
import { MenuListResponse, RecommendMenuRequest } from "../config/resultData";

export const getMenu = async (
  request: RecommendMenuRequest,
): Promise<MenuListResponse> => {
  // POST 로 body 에 실어서 보내기
  const { data } = await axiosInstance.post<MenuListResponse>(
    "/recommend",
    request,
  );
  return data;
};
