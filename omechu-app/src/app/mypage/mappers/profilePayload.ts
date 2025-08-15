import {
  ALLERGY_UI_TO_API,
  BODY_UI_TO_API,
} from "@/constant/mypage/profileOptions";

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
  bodyType: string[]; // 다중 선택 UI지만 서버는 단일 값이면 첫 번째만 보냄
  exercise: string | null;
  prefer: string[]; // 그대로 배열 전송
  allergy: string[]; // UI 라벨 배열 → API 문자열 배열 변환 필요
};

// 단일 문자열 정리
const trimOrUndef = (v?: string | null) =>
  v && v.trim() ? v.trim() : undefined;

// 배열 정리(공백 제거 → 빈 문자열 제거 → 중복 제거)
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

  // body_type: UI → API (첫 번째 선택만 반영)
  // 1) 사전 매핑(BODY_UI_TO_API) 시도
  // 2) 매핑 실패하면 키워드 기반으로 느슨하게 정규화(예: "땀이 많아서 더위를 잘 타요" → "더위잘탐")
  const bodyTypeFirstUi = s.bodyType?.[0];
  let bodyTypeFirstApi: string | undefined;
  if (bodyTypeFirstUi) {
    // 1) 명시적 매핑
    bodyTypeFirstApi = BODY_UI_TO_API[bodyTypeFirstUi] ?? undefined;

    // 2) 키워드 기반 정규화
    if (!bodyTypeFirstApi) {
      const raw = bodyTypeFirstUi.replace(/\s/g, "");
      if (raw.includes("더위")) bodyTypeFirstApi = "더위잘탐";
      else if (raw.includes("추위")) bodyTypeFirstApi = "추위잘탐";
      else if (raw.includes("감기")) bodyTypeFirstApi = "감기";
      else if (raw.includes("소화")) bodyTypeFirstApi = "소화불량";
    }
  }

  return {
    nickname: trimOrUndef(s.nickname),
    profileImageUrl: trimOrUndef(s.profileImageUrl),
    gender: trimOrUndef(s.gender),
    body_type: trimOrUndef(bodyTypeFirstApi),
    exercise: trimOrUndef(s.exercise),
    prefer: cleanArr(s.prefer),
    allergy: allergyApi,
  };
}

// ----- Below: helpers to build a "complete" payload by merging with current profile -----

// 서버에서 전체 필드를 요구할 수 있는 경우(예: /auth/complete)
// 기존 프로필과 스토어 값을 머지해 빈칸을 채운 완전한 payload 생성
export type CompleteProfilePayload = {
  nickname: string;
  profileImageUrl?: string;
  gender: string;
  body_type: string;
  exercise: string;
  prefer: string[];
  allergy: string[];
};

// React Query 등으로 받은 기존 프로필의 느슨한 형태
export type ProfileLike = {
  nickname?: string | null;
  profileImageUrl?: string | null;
  gender?: string | null;
  body_type?: string | null;
  exercise?: string | null;
  prefer?: string[] | null;
  allergy?: string[] | null;
};

// 스토어 스냅샷 + 기존 프로필을 합쳐서 완전한 payload 생성
export function buildCompletePayloadFromStore(
  s: StoreShape,
  current?: ProfileLike,
): CompleteProfilePayload {
  // 1) 스토어 기준 부분 payload 생성
  const partial = buildUpdatePayloadFromStore(s);

  // 2) 기존 프로필로 빈칸 채우기
  const nickname = partial.nickname ?? trimOrUndef(current?.nickname) ?? "";
  const profileImageUrl =
    partial.profileImageUrl ??
    trimOrUndef(current?.profileImageUrl) ??
    undefined;
  const gender = partial.gender ?? trimOrUndef(current?.gender) ?? "";
  const body_type = partial.body_type ?? trimOrUndef(current?.body_type) ?? "";
  const exercise = partial.exercise ?? trimOrUndef(current?.exercise) ?? "";
  const prefer = partial.prefer ?? cleanArr(current?.prefer || []) ?? [];
  const allergy = partial.allergy ?? cleanArr(current?.allergy || []) ?? [];

  return {
    nickname,
    profileImageUrl,
    gender,
    body_type,
    exercise,
    prefer,
    allergy,
  };
}
