import apiClient from "@/lib/api/client";

export async function getProfile() {
  const res = await apiClient.get(`/profile`);
  return res.data.success;
}
