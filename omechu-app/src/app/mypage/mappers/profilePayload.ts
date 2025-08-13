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

// 온보딩/기본상태입력 스토어 스냅샷 형태에 맞춤
type StoreShape = {
  nickname: string | null;
  profileImageUrl?: string | null;
  gender: string | null;
  bodyType: string[]; // 다중 선택 UI지만, 서버는 단일 값이면 첫 번째만 보냄
  exercise: string | null;
  prefer: string[]; // 그대로 배열 전송
  allergy: string[]; // UI 라벨 배열 → API 문자열 배열 변환 필요
};

// 단일 문자열 정리
const trimOrUndef = (v?: string | null) =>
  v && v.trim() ? v.trim() : undefined;

// 배열 정리(공백 제거 → 빈 문자열 제거 → 중복 제거)
// 필요 없으면 undefined 로
const cleanArr = (arr?: string[]) => {
  if (!arr || arr.length === 0) return undefined;
  const cleaned = Array.from(
    new Set(arr.map((s) => (s ?? "").trim()).filter(Boolean)),
  );
  return cleaned.length ? cleaned : undefined;
};

export function buildUpdatePayloadFromStore(
  s: StoreShape,
): UpdateProfilePayload {
  // 알레르기: UI 라벨 → API 문자열 변환 + 중복 제거
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

  // body_type: 여러 개 중 첫 번째만 전달(백엔드 정책에 맞춰 필요 시 변경)
  const bodyTypeFirst = s.bodyType?.[0] ?? undefined;

  return {
    nickname: trimOrUndef(s.nickname),
    profileImageUrl: trimOrUndef(s.profileImageUrl),
    gender: trimOrUndef(s.gender),
    body_type: trimOrUndef(bodyTypeFirst),
    exercise: trimOrUndef(s.exercise),
    prefer: cleanArr(s.prefer),
    allergy: allergyApi,
  };
}
