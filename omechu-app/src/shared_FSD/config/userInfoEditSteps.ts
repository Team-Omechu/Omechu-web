import AllergyStep from "@/mypage/user-info-edit/[step]/AllergyStep";
import ConditionStep from "@/mypage/user-info-edit/[step]/ConditionStep";
import EditStart from "@/mypage/user-info-edit/[step]/EditStart";
import FoodStep from "@/mypage/user-info-edit/[step]/FoodStep";
import GenderStep from "@/mypage/user-info-edit/[step]/GenderStep";
import StateStep from "@/mypage/user-info-edit/[step]/StateStep";

// step key 타입을 먼저 정의
export type StepKey =
  | "start"
  | "gender"
  | "exercise"
  | "prefer"
  | "body_type"
  | "allergy";

// 각 스텝별 컴포넌트를 타입으로 명시
export const stepComponents: Record<StepKey, () => React.ReactNode> = {
  start: EditStart,
  gender: GenderStep,
  exercise: StateStep,
  prefer: FoodStep,
  body_type: ConditionStep,
  allergy: AllergyStep,
};

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
