import apiClient from "@/lib/api/client";

export async function fetchProfile(userId: number) {
  const res = await apiClient.get(`/test/profile/${userId}`);
  return res.data.success;
}
