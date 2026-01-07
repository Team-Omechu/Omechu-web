import {
  ALLERGY_UI_TO_API,
  BODY_UI_TO_API,
} from "@/shared/config/profileOptions";

// ▶︎ Backend spec (2025-08):
// - gender: "여성" | "남성"
// - exercise: "다이어트 중" | "증량 중" | "유지 중"
// - body_type: "감기" | "소화불량" | "더위잘탐" | "추위잘탐"
// - prefer: ["한식", "양식", "중식", "일식", "다른나라"]
// - allergy: ["달걀(난류) 알레르기", "우유 알레르기", "갑각류 알레르기", "해산물 알레르기", "견과류 알레르기"]

export type UpdateProfilePayload = {
  nickname?: string | null; // ✅ null 허용 (빈 문자열은 null로 정규화)
  profileImageUrl?: string | null; // ✅ null 허용(이미지 제거)
  gender?: string | null; // 여성 | 남성 | null(없음)
  body_type?: string | null; // 감기 | 소화불량 | 더위잘탐 | 추위잘탐 | null
  exercise?: string | null; // 다이어트 중 | 증량 중 | 유지 중 | null
  prefer?: string[]; // 배열은 빈 배열도 포함하여 없음 처리
  allergy?: string[]; // 배열은 빈 배열도 포함하여 없음 처리
};

// 온보딩/기본상태입력 스토어 스냅샷 형태에 맞춤
type StoreShape = {
  nickname: string | null;
  profileImageUrl?: string | null;
  gender: string | null; // 코드 또는 라벨
  sex?: string | null; // 🔄 구버전 호환
  bodyType: string[]; // UI 라벨(서버는 단일 값 → 첫 번째만 사용)
  exercise: string | null; // 코드 또는 라벨
  state?: string | null; // 🔄 구버전 호환
  prefer: string[];
  allergy: string[];
};

// ────────────────────────────────────────────────────────────────────────────────
// helpers

const trimOrUndef = (v?: string | null) =>
  v && v.trim() ? v.trim() : undefined;
const uniq = (arr: string[]) => Array.from(new Set(arr));

// 배열 정리 + 매핑 적용 유틸(빈 배열은 undefined 반환)
const mapClean = (
  arr: string[] | undefined,
  mapper: (s: string) => string | undefined,
) => {
  if (!arr || arr.length === 0) return undefined;
  const cleaned = uniq(
    arr
      .map((s) => (s ?? "").trim())
      .filter(Boolean)
      .map((s) => mapper(s) || "")
      .filter(Boolean),
  );
  return cleaned.length ? cleaned : undefined;
};

// UI → API 정규화: gender → "여성" | "남성"
const normalizeGender = (v?: string | null) => {
  const s = (v ?? "").trim();
  if (!s) return undefined;
  const u = s.toUpperCase();
  if (u === "F" || s === "여성") return "여성";
  if (u === "M" || s === "남성") return "남성";
  return s; // 이미 라벨일 가능성
};

// UI → API 정규화: exercise → "다이어트 중" | "증량 중" | "유지 중"
const normalizeExercise = (v?: string | null) => {
  const s = (v ?? "").trim();
  if (!s) return undefined;
  const u = s.toUpperCase();
  if (u === "DIET" || s.includes("다이어트")) return "다이어트 중";
  if (u === "BULK" || s.includes("증량")) return "증량 중";
  if (u === "MAINTAIN" || s.includes("유지")) return "유지 중";
  return s;
};

// UI → API 정규화: body_type (첫 번째 항목만 사용)
const normalizeBodyType = (label?: string) => {
  if (!label) return undefined;
  const mapped = BODY_UI_TO_API[label as keyof typeof BODY_UI_TO_API];
  if (mapped) return mapped; // 스펙 값과 동치
  const raw = label.replace(/\s/g, "");
  if (raw.includes("더위")) return "더위잘탐";
  if (raw.includes("추위")) return "추위잘탐";
  if (raw.includes("감기")) return "감기";
  if (raw.includes("소화")) return "소화불량";
  return undefined;
};

// UI → API 정규화: prefer 항목 → 스펙 라벨 통일
const normalizePreferItem = (v: string) => {
  const s = v.trim();
  if (!s) return undefined;
  if (["한식", "양식", "중식", "일식", "다른나라"].includes(s)) return s;
  if (s.includes("다른나라")) return "다른나라";
  if (s.includes("한식")) return "한식";
  if (s.includes("양식")) return "양식";
  if (s.includes("중식")) return "중식";
  if (s.includes("일식")) return "일식";
  const u = s.toUpperCase();
  if (u === "KOR") return "한식";
  if (u === "WES" || u === "WESTERN") return "양식";
  if (u === "CHI" || u === "CHINESE") return "중식";
  if (u === "JPN" || u === "JAPANESE") return "일식";
  return undefined;
};

// UI → API 정규화: allergy 항목 → 스펙 라벨 통일
const normalizeAllergyItem = (v: string) => {
  const s = v.trim();
  if (!s) return undefined;
  const mapped = ALLERGY_UI_TO_API[s as keyof typeof ALLERGY_UI_TO_API];
  if (mapped) return mapped;
  const base = s.replace(/\s+/g, "");
  if (base.includes("달걀") || base.includes("난류"))
    return "달걀(난류) 알레르기";
  if (base.includes("우유") || base.includes("유제품")) return "우유 알레르기";
  if (base.includes("갑각류")) return "갑각류 알레르기";
  if (base.includes("해산물")) return "해산물 알레르기";
  if (base.includes("견과")) return "견과류 알레르기";
  return undefined;
};

// NOTE: nickname/profileImageUrl are non-destructive — only sent when provided (avoid accidental clearing).

// 1) 부분 업데이트용 페이로드: 명시적으로 전달된 null/빈배열을 그대로 포함
export function buildUpdatePayloadFromStore(
  s: StoreShape,
): UpdateProfilePayload {
  const allergyApi = mapClean(s.allergy, normalizeAllergyItem) ?? [];
  const bodyTypeFirstApi = normalizeBodyType(s.bodyType?.[0]) ?? null;
  const genderApi = normalizeGender(s.gender ?? (s as any)?.sex) ?? null;
  const exerciseApi =
    normalizeExercise(s.exercise ?? (s as any)?.state) ?? null;
  const preferApi = mapClean(s.prefer, normalizePreferItem);

  // 기본(파괴적 허용) 필드: 단일값은 null 허용, 배열은 빈 배열 포함
  const out: UpdateProfilePayload = {
    gender: genderApi,
    body_type: bodyTypeFirstApi,
    exercise: exerciseApi,
    prefer: Array.isArray(s.prefer) ? (preferApi ?? []) : [],
    allergy: Array.isArray(s.allergy) ? allergyApi : [],
  } as UpdateProfilePayload;

  // 비파괴 필드: 값이 주어졌을 때만 포함 (의도치 않은 초기화 방지)
  const nick = trimOrUndef(s.nickname);
  if (nick !== undefined) {
    out.nickname = nick;
  }

  const img = trimOrUndef(s.profileImageUrl ?? undefined);
  if (img !== undefined) {
    out.profileImageUrl = img;
  }

  return out;
}

// ----- Below: helpers to build a "complete" payload by merging with current profile -----

export type CompleteProfilePayload = {
  nickname: string | null;
  profileImageUrl?: string | null;
  gender: string | null;
  body_type: string | null;
  exercise: string | null;
  prefer: string[];
  allergy: string[];
};

export type ProfileLike = {
  nickname?: string | null;
  profileImageUrl?: string | null;
  gender?: string | null;
  body_type?: string | null;
  exercise?: string | null;
  prefer?: string[] | null;
  allergy?: string[] | null;
};

// 2) 완전 페이로드: 부분값을 우선 적용하되, 전달되지 않은 키만 current로 보완
export function buildCompletePayloadFromStore(
  s: StoreShape,
  current?: ProfileLike,
): CompleteProfilePayload {
  const partial = buildUpdatePayloadFromStore(s);
  const has = (k: keyof UpdateProfilePayload) =>
    Object.prototype.hasOwnProperty.call(partial, k);

  const nickname = has("nickname")
    ? (partial.nickname ?? null)
    : (trimOrUndef(current?.nickname) ?? null);

  const profileImageUrl = has("profileImageUrl")
    ? (partial.profileImageUrl ?? null)
    : (trimOrUndef(current?.profileImageUrl) ?? null);

  const gender = has("gender")
    ? (partial.gender ?? null)
    : (trimOrUndef(normalizeGender(current?.gender ?? (current as any)?.sex)) ??
      null);

  const body_type = has("body_type")
    ? (partial.body_type ?? null)
    : (trimOrUndef(normalizeBodyType(current?.body_type || undefined)) ?? null);

  const exercise = has("exercise")
    ? (partial.exercise ?? null)
    : (trimOrUndef(
        normalizeExercise(current?.exercise ?? (current as any)?.state),
      ) ?? null);

  const prefer = has("prefer")
    ? (partial.prefer as string[])
    : (mapClean(current?.prefer || [], normalizePreferItem) ?? []);

  const allergy = has("allergy")
    ? (partial.allergy as string[])
    : (mapClean(current?.allergy || [], normalizeAllergyItem) ?? []);

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
