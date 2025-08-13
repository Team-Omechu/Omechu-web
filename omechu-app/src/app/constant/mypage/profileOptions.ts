// 성별
export const GENDER = ["남성", "여성"] as const;
export type Gender = (typeof GENDER)[number];

// 체질/체감 온도 같은 상태
export const BODY_TYPE = ["감기", "소화불량", "더위잘탐", "추위잘탐"] as const;
export type BodyType = (typeof BODY_TYPE)[number];

// 운동 상태
export const EXERCISE = ["다이어트 중", "증량 중", "유지 중"] as const;
export type Exercise = (typeof EXERCISE)[number];

// 선호 음식
export const PREFER = [
  "한식",
  "양식",
  "중식",
  "일식",
  "다른나라 음식",
] as const;
export type Prefer = (typeof PREFER)[number];

// 알레르기: UI 라벨 ↔ API 문자열
export const ALLERGY_OPTIONS = [
  { key: "달걀 (난류)", api: "달걀(난류) 알레르기" },
  { key: "유제품", api: "우유 알레르기" },
  { key: "갑각류", api: "갑각류 알레르기" },
  { key: "해산물", api: "해산물 알레르기" },
  { key: "견과류", api: "견과류 알레르기" },
] as const;

export type AllergyKey = (typeof ALLERGY_OPTIONS)[number]["key"];
export type AllergyApi = (typeof ALLERGY_OPTIONS)[number]["api"];

// 빠른 매핑용 맵 (UI -> API)
export const ALLERGY_UI_TO_API: Record<AllergyKey, AllergyApi> =
  Object.fromEntries(ALLERGY_OPTIONS.map((o) => [o.key, o.api])) as Record<
    AllergyKey,
    AllergyApi
  >;

// 필요하면 역매핑(API -> UI)도 바로 쓸 수 있게
export const ALLERGY_API_TO_UI: Record<AllergyApi, AllergyKey> =
  Object.fromEntries(ALLERGY_OPTIONS.map((o) => [o.api, o.key])) as Record<
    AllergyApi,
    AllergyKey
  >;
