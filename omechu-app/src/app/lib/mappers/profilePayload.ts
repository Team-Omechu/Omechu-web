import { ALLERGY_UI_TO_API } from "@/constant/mypage/profileOptions";

export type UpdateProfilePayload = {
  nickname?: string;
  profileImageUrl?: string;
  gender?: string;
  body_type?: string;
  exercise?: string;
  prefer?: string[];
  allergy?: string[];
};

// 현재 온보딩/기본상태입력 스토어 형태에 맞춰 타입 정의(필요시 수정)
type StoreShape = {
  nickname: string | null;
  profileImageUrl?: string | null;
  gender: string | null;
  bodyType: string[];
  exercise: string | null;
  prefer: string[];
  allergy: string[];
};

export function buildUpdatePayloadFromStore(
  s: StoreShape,
): UpdateProfilePayload {
  const trim = (v?: string | null) => (v && v.trim() ? v.trim() : undefined);
  const arr = (a?: string[]) => (a && a.length ? a : undefined);

  // UI 라벨 -> API 문자열 매핑
  const allergyApi =
    s.allergy && s.allergy.length
      ? Array.from(
          new Set(
            s.allergy
              .map(
                (k) => ALLERGY_UI_TO_API[k as keyof typeof ALLERGY_UI_TO_API],
              )
              .filter(Boolean),
          ),
        )
      : undefined;

  return {
    nickname: trim(s.nickname ?? undefined),
    profileImageUrl: trim(s.profileImageUrl ?? undefined),
    gender: trim(s.gender ?? undefined),
    body_type: s.bodyType?.[0], // 첫 선택만 반영
    exercise: trim(s.exercise ?? undefined),
    prefer: arr(s.prefer),
    allergy: allergyApi,
  };
}
