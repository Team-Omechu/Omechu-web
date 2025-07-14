import AllergyStep from "@/app/mypage/user-info-edit/[step]/AllergyStep";
import ConditionStep from "@/app/mypage/user-info-edit/[step]/ConditionStep";
import EditStart from "@/app/mypage/user-info-edit/[step]/EditStart";
import FoodStep from "@/app/mypage/user-info-edit/[step]/FoodStep";
import GenderStep from "@/app/mypage/user-info-edit/[step]/GenderStep";
import StateStep from "@/app/mypage/user-info-edit/[step]/StateStep";

// step key 타입을 먼저 정의
export type StepKey =
  | "start"
  | "gender"
  | "state"
  | "food"
  | "condition"
  | "allergy";

// 각 스텝별 컴포넌트를 타입으로 명시
export const stepComponents: Record<StepKey, () => React.ReactNode> = {
  start: EditStart,
  gender: GenderStep,
  state: StateStep,
  food: FoodStep,
  condition: ConditionStep,
  allergy: AllergyStep,
};

// step 순서 배열
export const stepOrder: StepKey[] = [
  "start",
  "gender",
  "state",
  "food",
  "condition",
  "allergy",
];

// slug → index 매핑
export const slugToIndex: Record<StepKey, number> = {
  start: 0,
  gender: 1,
  state: 2,
  food: 3,
  condition: 4,
  allergy: 5,
};

// index → slug 매핑
export const indexToSlug: Record<number, StepKey> = {
  0: "start",
  1: "gender",
  2: "state",
  3: "food",
  4: "condition",
  5: "allergy",
};
