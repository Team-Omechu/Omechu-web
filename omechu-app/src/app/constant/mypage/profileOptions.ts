// 성별
export const GENDER = ["남성", "여성"] as const;
export type Gender = (typeof GENDER)[number];

// 체질/컨디션(서버 허용값)
export const BODY_TYPE = ["감기", "소화불량", "더위잘탐", "추위잘탐"] as const;
export type BodyType = (typeof BODY_TYPE)[number];

// 운동 상태(서버 허용값)
export const EXERCISE = ["다이어트 중", "증량 중", "유지 중"] as const;
export type Exercise = (typeof EXERCISE)[number];

// 선호 음식 카테고리(자유 배열)
export const PREFER = [
  "한식",
  "양식",
  "중식",
  "일식",
  "다른나라 음식",
] as const;
export type Prefer = (typeof PREFER)[number];

// 알레르기 옵션(서버 허용값)
export const ALLERGY_OPTIONS = [
  { key: "달걀 (난류)", api: "달걀(난류) 알레르기" },
  { key: "유제품", api: "우유 알레르기" },
  { key: "갑각류", api: "갑각류 알레르기" },
  { key: "해산물", api: "해산물 알레르기" },
  { key: "견과류", api: "견과류 알레르기" },
] as const;
export type AllergyKey = (typeof ALLERGY_OPTIONS)[number]["key"];
export type AllergyApi = (typeof ALLERGY_OPTIONS)[number]["api"];

/**
 * UI 라벨 → API 값 (체질)
 *   UI에서 설명형 문구를 쓰는 경우를 서버 허용값으로 변환
 *   이미 서버값(감기/소화불량/더위잘탐/추위잘탐)인 경우는 페이로드에서 그대로 통과시켜도 됨
 */
export const BODY_UI_TO_API: Record<string, BodyType> = {
  "감기에 자주 걸려요": "감기",
  "소화가 자주 안돼요": "소화불량",
  "땀이 많아서 더위를 잘 타요": "더위잘탐",
  "손발이 차고 추위를 잘 타요": "추위잘탐",
  // 혹시 UI가 곧바로 서버값을 쓸 수도 있으니 안전하게 매핑 추가(패스스루 성격)
  감기: "감기",
  소화불량: "소화불량",
  더위잘탐: "더위잘탐",
  추위잘탐: "추위잘탐",
};

/**
 * 알레르기 오타/동의어 보정(선택)
 *   팀/환경마다 라벨이 섞일 때 대비용
 */
const ALLERGY_FALLBACK: Record<string, AllergyApi> = {
  // 실수 잦은 케이스: '건강류' → '갑각류'
  건강류: "갑각류 알레르기",
  "건강류 알레르기": "갑각류 알레르기",
};

/**
 * 알레르기: UI 라벨 → API 문자열
 */
export const ALLERGY_UI_TO_API: Record<AllergyKey | string, AllergyApi> = {
  ...Object.fromEntries(ALLERGY_OPTIONS.map((o) => [o.key, o.api])),
  ...ALLERGY_FALLBACK,
} as any;
