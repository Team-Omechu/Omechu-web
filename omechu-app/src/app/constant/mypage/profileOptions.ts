export const GENDER = ["남성", "여성"] as const;
export type Gender = (typeof GENDER)[number];

export const BODY_TYPE = ["감기", "소화불량", "더위잘탐", "추위잘탐"] as const;
export type BodyType = (typeof BODY_TYPE)[number];

export const EXERCISE = ["다이어트 중", "증량 중", "유지 중"] as const;
export type Exercise = (typeof EXERCISE)[number];

export const PREFER = [
  "한식",
  "양식",
  "중식",
  "일식",
  "다른나라 음식",
] as const;
export type Prefer = (typeof PREFER)[number];

export const ALLERGY_OPTIONS = [
  { key: "달걀 (난류)", api: "달걀(난류) 알레르기" },
  { key: "유제품", api: "우유 알레르기" },
  { key: "갑각류", api: "갑각류 알레르기" },
  { key: "해산물", api: "해산물 알레르기" },
  { key: "견과류", api: "견과류 알레르기" },
] as const;
export type AllergyKey = (typeof ALLERGY_OPTIONS)[number]["key"];
export type AllergyApi = (typeof ALLERGY_OPTIONS)[number]["api"];

// 빠른 변환용 맵
export const ALLERGY_UI_TO_API: Record<AllergyKey, AllergyApi> =
  Object.fromEntries(ALLERGY_OPTIONS.map((o) => [o.key, o.api])) as any;
