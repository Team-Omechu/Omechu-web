import apiClient from "@/lib/api/client";

export interface UserProfile {
  id: number;
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

export async function fetchProfile(): Promise<UserProfile | null> {
  try {
    const res = await apiClient.get("/profile");
    const data = res.data.success;
    return {
      ...data,
      id: Number(data.id),
      nickname: data.nickname ?? "",
      body_type: data.body_type ?? "",
      gender: data.gender ?? "",
      exercise: data.exercise ?? "",
      prefer: Array.isArray(data.prefer) ? data.prefer : [],
      allergy: Array.isArray(data.allergy) ? data.allergy : [],
      profileImageUrl: data.profileImageUrl ?? null,
    };
  } catch (error: any) {
    const code = error?.response?.status ?? 500;
    // 디버깅 콘솔.로그
    console.error("[getProfile] 에러:", error?.response ?? error);
    throw new ProfileApiError(code, error.response?.data);
  }
}
