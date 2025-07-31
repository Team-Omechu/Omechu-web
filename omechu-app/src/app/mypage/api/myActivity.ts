import apiClient from "@/lib/api/client";

export const fetchRestaurants = async (userId: string) => {
  const res = await apiClient.get(`/test/restaurants/${userId}`);
  return res.data.success?.data ?? [];
};
