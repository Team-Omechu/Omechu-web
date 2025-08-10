import axiosInstance from "@/lib/api/axios";

// * 찜 목록 조회 API
export const fetchHeartList = async (userId: number | undefined) => {
  const { data } = await axiosInstance.get(`/hearts/${userId}`);
  // 서버 응답 형태: { resultType, error, success: { data: [...] } }
  if (data?.success?.data && Array.isArray(data.success.data)) {
    return data.success.data;
  }
  return [];
};

//* 찜 등록 API
export const likePlace = async (
  userId: number | undefined,
  restaurantId: number | undefined,
) => {
  return axiosInstance.post("/heart", {
    userId,
    restaurantId,
  });
};

// * 찜 해제 API
export const unlikePlace = async (
  userId: number | undefined,
  restaurantId: number | undefined,
) => {
  return axiosInstance.delete("/heart", {
    data: { userId, restaurantId },
  });
};
