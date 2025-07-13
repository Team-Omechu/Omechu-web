import EditStart from "@/app/mypage/user-info-edit/[step]/EditStart";
import GenderStep from "@/app/mypage/user-info-edit/[step]/GenderStep";
import StateStep from "@/app/mypage/user-info-edit/[step]/StateStep";
import FoodStep from "@/app/mypage/user-info-edit/[step]/FoodStep";
import ConditionStep from "@/app/mypage/user-info-edit/[step]/ConditionStep";
import AllergyStep from "@/app/mypage/user-info-edit/[step]/AllergyStep";

export const stepComponents = {
  start: EditStart,
  gender: GenderStep,
  state: StateStep,
  food: FoodStep,
  condition: ConditionStep,
  allergy: AllergyStep,
};

export const stepOrder = [
  "start",
  "gender",
  "state",
  "food",
  "condition",
  "allergy",
];

export const slugToIndex: Record<string, number> = {
  start: 0,
  gender: 1,
  state: 2,
  food: 3,
  condition: 4,
  allergy: 5,
};

export const indexToSlug: Record<number, string> = {
  0: "start",
  1: "gender",
  2: "state",
  3: "food",
  4: "condition",
  5: "allergy",
};
