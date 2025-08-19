import axiosInstance from "@/lib/api/axios";
import { ProfileType } from "../types/profileType";
import { useAuthStore } from "@/lib/stores/auth.store";

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
    // axiosInstance가 인터셉터에서 토큰을 붙인다는 가정
    const res = await axiosInstance.get("/profile", {
      params: { _ts: Date.now() },
      headers: { "Cache-Control": "no-cache, no-store", Pragma: "no-cache" },
      // 304일 때도 여기서 처리할 수 있게 허용
      validateStatus: (s) => s === 200 || s === 304,
    });

    // 304 Not Modified: 캐시(스토어)에 있는 사용자 정보를 그대로 사용
    if (res.status === 304) {
      const cached = useAuthStore.getState().user;
      if (cached) {
        return {
          id: Number(String((cached as any).id ?? 0)),
          email: (cached as any).email ?? "",
          nickname: (cached as any).nickname ?? "",
          bodyType: (cached as any).body_type ?? "",
          gender: (cached as any).gender ?? "",
          exercise: (cached as any).exercise ?? "",
          prefer: Array.isArray((cached as any).prefer)
            ? (cached as any).prefer
            : [],
          allergy: Array.isArray((cached as any).allergy)
            ? (cached as any).allergy
            : [],
          profileImageUrl:
            (cached as any).profileImageUrl ??
            (cached as any).profile_image_url ??
            (cached as any).avatar_url ??
            null,
          createdAt: (cached as any).created_at ?? "",
          updatedAt: (cached as any).updated_at ?? "",
        };
      }
      // 캐시가 없으면 강제로 200을 다시 받아오도록 에러 처리
      throw new ProfileApiError(304, {
        message: "No cached profile to use for 304.",
      });
    }

    // 200 OK
    const data = res.data?.success ?? {};
    return {
      id: Number(data.id ?? 0),
      email: data.email ?? "",
      nickname: data.nickname ?? "",
      bodyType: data.body_type ?? "",
      gender: data.gender ?? "",
      exercise: data.exercise ?? "",
      prefer: Array.isArray(data.prefer) ? data.prefer : [],
      allergy: Array.isArray(data.allergy) ? data.allergy : [],
      profileImageUrl:
        data.profileImageUrl ??
        data.profile_image_url ??
        data.avatar_url ??
        null,
      createdAt: data.created_at ?? "",
      updatedAt: data.updated_at ?? "",
    };
  } catch (error: any) {
    const code = error?.response?.status ?? error?.code ?? 500;
    // 디버깅 콘솔.로그 (간결하게)
    console.error("[fetchProfile] error:", error?.response ?? error);
    throw new ProfileApiError(code, error?.response?.data ?? error?.message);
  }
}
