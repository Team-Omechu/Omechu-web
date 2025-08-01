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

export class ProfileApiError extends Error {
  constructor(
    public code: number,
    public info?: any,
  ) {
    super("Profile API Error");
    this.name = "ProfileApiError";
  }
}

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const res = await apiClient.get("/profile");
    const data = res.data.success;
    return {
      ...data,
      prefer: data.prefer ?? [],
      allergy: data.allergy ?? [],
      profileImageUrl: data.profileImageUrl ?? null,
    };
  } catch (error: any) {
    const code = error?.response?.status ?? 500;
    throw new ProfileApiError(code, error.response?.data);
  }
}
