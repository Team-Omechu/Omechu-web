import apiClient from "@/lib/api/client";

// * 찜 목록 조회 API
export const fetchHeartList = async (userId: number | undefined) => {
  const { data } = await apiClient.get(`/hearts/${userId}`);
  if (Array.isArray(data)) return data;
  return []; // 배열이 아니면 무조건 빈 배열 리턴
};

//* 찜 등록 API
export const likePlace = async (
  userId: number | undefined,
  restaurantId: number | undefined,
) => {
  return apiClient.post("/heart", {
    userId,
    restaurantId,
  });
};

// * 찜 해제 API
export const unlikePlace = async (
  userId: number | undefined,
  restaurantId: number | undefined,
) => {
  return apiClient.delete("/heart", {
    data: { userId, restaurantId },
  });
};
