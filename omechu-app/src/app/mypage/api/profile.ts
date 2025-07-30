import apiClient from "@/lib/api/client";

export async function getProfile(userId: string) {
  const res = await apiClient.get(`/test/profile/${userId}`);
  return res.data.success;
}
