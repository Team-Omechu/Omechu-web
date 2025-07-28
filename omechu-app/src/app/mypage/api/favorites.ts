import apiClient from "@/lib/api/client";

export const fetchHeartList = async (userId: string | number) => {
  const { data } = await apiClient.get(`/test/hearts/${userId}`);
  if (Array.isArray(data)) return data;
  return []; // 배열이 아니면 무조건 빈 배열 리턴
};
