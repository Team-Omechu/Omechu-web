import apiClient from "@/lib/api/client";

export async function getProfile(userId: number) {
  const res = await apiClient.get(`/profile/${userId}`);
  return res.data.success;
}
