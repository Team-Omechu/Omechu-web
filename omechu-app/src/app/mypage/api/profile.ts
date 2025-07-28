import apiClient from "@/lib/api/client";

export async function getProfile(userId: number) {
  const res = await apiClient.get(`/test/profile/${userId}`);
  return res.data.success;
}
