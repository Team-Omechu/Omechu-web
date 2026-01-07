// step key 타입을 먼저 정의
export type StepKey =
  | "start"
  | "gender"
  | "exercise"
  | "prefer"
  | "body_type"
  | "allergy";

// step 순서 배열
export const stepOrder: StepKey[] = [
  "start",
  "gender",
  "exercise",
  "prefer",
  "body_type",
  "allergy",
];

// slug → index 매핑
export const slugToIndex: Record<StepKey, number> = {
  start: 0,
  gender: 1,
  exercise: 2,
  prefer: 3,
  body_type: 4,
  allergy: 5,
};

// index → slug 매핑
export const indexToSlug: Record<number, StepKey> = {
  0: "start",
  1: "gender",
  2: "exercise",
  3: "prefer",
  4: "body_type",
  5: "allergy",
};
