import axiosInstance from "@/lib/api/axios";
import { ProfileType } from "../types/profileType";

export class ProfileApiError extends Error {
  constructor(
    public code: number,
    public info?: any,
  ) {
    super("Profile API Error");
    this.name = "ProfileApiError";
  }
}

export async function fetchProfile(): Promise<ProfileType> {
  try {
    const res = await axiosInstance.get("/profile");
    const data = res.data.success;
    return {
      id: Number(data.id),
      email: data.email ?? "",
      nickname: data.nickname ?? "",
      bodyType: data.body_type ?? "",
      gender: data.gender ?? "",
      exercise: data.exercise ?? "",
      prefer: Array.isArray(data.prefer) ? data.prefer : [],
      allergy: Array.isArray(data.allergy) ? data.allergy : [],
      profileImageUrl: data.profileImageUrl ?? null,
      createdAt: data.created_at ?? "",
      updatedAt: data.updated_at ?? "",
    };
  } catch (error: any) {
    const code = error?.response?.status ?? 500;
    // 디버깅 콘솔.로그
    console.error("[getProfile] 에러:", error?.response ?? error);
    console.error("[getProfile] 에러:", error?.response ?? error);
    throw new ProfileApiError(code, error.response?.data);
  }
}
