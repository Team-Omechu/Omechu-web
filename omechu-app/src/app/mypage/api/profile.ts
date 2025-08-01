import apiClient from "@/lib/api/client";

export interface UserProfile {
  id: string;
  email: string;
  nickname: string | null;
  body_type: string | null;
  gender: string | null;
  exercise: string | null;
  prefer: string[];
  allergy: string[];
  profileImageUrl: string | null;
  created_at: string;
  updated_at: string;
}

export async function getProfile(): Promise<UserProfile> {
  const res = await apiClient.get(`/profile`);
  return res.data.success;
}
