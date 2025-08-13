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

/**
 * 내 프로필 조회
 * - Authorization 헤더는 axiosInstance 인터셉터에서 자동으로 설정됩니다.
 * - resultType 래핑을 검사하고 FAIL 시 ProfileApiError 를 던집니다.
 * - 호출 측에서 취소가 필요하면 AbortSignal 을 넘겨주세요.
 */
export async function fetchProfile(signal?: AbortSignal): Promise<ProfileType> {
  try {
    const res = await axiosInstance.get("/profile", { signal });

    const envelope = res?.data;
    if (!envelope || envelope.resultType !== "SUCCESS" || !envelope.success) {
      // 서버 표준 에러 포맷 반영
      const code = res?.status ?? 500;
      throw new ProfileApiError(code, envelope?.error ?? envelope);
    }

    const data = envelope.success;

    // 안전 가드
    const toArray = (v: unknown) => (Array.isArray(v) ? v : []);

    const profile: ProfileType = {
      id: Number(data.id),
      email: data.email ?? "",
      nickname: data.nickname ?? "",
      bodyType: data.body_type ?? "",
      gender: data.gender ?? "",
      exercise: data.exercise ?? "",
      prefer: toArray(data.prefer),
      allergy: toArray(data.allergy),
      profileImageUrl: data.profileImageUrl ?? null,
      createdAt: data.created_at ?? "",
      updatedAt: data.updated_at ?? "",
    };

    return profile;
  } catch (error: any) {
    const code =
      error?.response?.status ?? (error?.code === "ERR_CANCELED" ? 499 : 500);
    // 최소한의 디버그 로그
    console.error("[fetchProfile] 요청 실패:", error?.response?.data ?? error);
    throw new ProfileApiError(code, error?.response?.data ?? error);
  }
}

// --- 아래를 profile.ts 맨 아래쪽에 추가 ---

export type UpdateProfilePayload = {
  email?: string;
  nickname?: string;
  gender?: "남성" | "여성";
  body_type?: string; // 예: "감기" | "소화불량" | ...
  exercise?: "다이어트 중" | "증량 중" | "유지 중";
  prefer?: string[]; // 예: ["한식","일식",...]
  allergy?: string[]; // 예: ["우유 알레르기", ...]
  profileImageUrl?: string | null;
};

/** 서버 포맷 → 클라이언트 ProfileType 정규화 (fetchProfile과 동일 로직 재사용) */
function normalizeProfile(data: any): ProfileType {
  const toArray = (v: unknown) => (Array.isArray(v) ? v : []);
  return {
    id: Number(data.id),
    email: data.email ?? "",
    nickname: data.nickname ?? "",
    bodyType: data.body_type ?? "",
    gender: data.gender ?? "",
    exercise: data.exercise ?? "",
    prefer: toArray(data.prefer),
    allergy: toArray(data.allergy),
    profileImageUrl: data.profileImageUrl ?? null,
    createdAt: data.created_at ?? "",
    updatedAt: data.updated_at ?? "",
  };
}

/**
 * 내 프로필 수정
 * - JWT는 axiosInstance 인터셉터가 붙여줌
 * - resultType 래핑 검사
 * - 성공 시 최신 프로필을 반환(정규화)
 */
export async function updateProfile(
  payload: UpdateProfilePayload,
  signal?: AbortSignal,
): Promise<ProfileType> {
  // 방어적 정리: 공백 제거 + 배열 세이프가드
  const trimStr = (v?: string | null) =>
    typeof v === "string" ? v.trim() : (v ?? undefined);
  const cleanArray = (arr?: string[]) =>
    Array.isArray(arr)
      ? Array.from(
          new Set(
            arr.map((s) => (typeof s === "string" ? s.trim() : "")),
          ).values(),
        ).filter(Boolean)
      : undefined;

  const body = {
    email: trimStr(payload.email),
    nickname: trimStr(payload.nickname),
    gender: trimStr(payload.gender as any),
    body_type: trimStr(payload.body_type),
    exercise: trimStr(payload.exercise as any),
    prefer: cleanArray(payload.prefer),
    allergy: cleanArray(payload.allergy),
    profileImageUrl:
      payload.profileImageUrl === null
        ? null
        : trimStr(payload.profileImageUrl),
  };

  try {
    const res = await axiosInstance.patch("/profile", body, { signal });
    const envelope = res?.data;

    if (!envelope || envelope.resultType !== "SUCCESS" || !envelope.success) {
      const code = res?.status ?? 500;
      throw new ProfileApiError(code, envelope?.error ?? envelope);
    }
    return normalizeProfile(envelope.success);
  } catch (error: any) {
    const code =
      error?.response?.status ?? (error?.code === "ERR_CANCELED" ? 499 : 500);
    console.error("[updateProfile] 요청 실패:", error?.response?.data ?? error);
    throw new ProfileApiError(code, error?.response?.data ?? error);
  }
}
