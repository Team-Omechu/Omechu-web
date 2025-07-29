import apiClient from "@/lib/api/client";

export const fetchHeartList = async (userId: string | number) => {
  const { data } = await apiClient.get(`/test/hearts/${userId}`);
  if (Array.isArray(data)) return data;
  return []; // 배열이 아니면 무조건 빈 배열 리턴
};

//* 찜 등록 API
export const likePlace = async (userId: number, restaurantId: number) => {
  return apiClient.post("/test/heart", {
    userId,
    restaurantId,
  });
};

// * 찜 해제 API
export const unlikePlace = async (userId: number, restaurantId: number) => {
  return apiClient.delete("/test/heart", {
    data: { userId, restaurantId },
  });
};
