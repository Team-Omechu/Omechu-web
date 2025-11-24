import { RandomMenu, RandomMenuRequest } from "../config/resultData";

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
