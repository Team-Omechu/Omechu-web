import { notFound } from "next/navigation";

import EditStart from "./EditStart";
import GenderStep from "./GenderStep";
import StateStep from "./StateStep";
import FoodStep from "./FoodStep";
import ConditionStep from "./ConditionStep";
import AllergyStep from "./AllergyStep";

interface StepComponentMap {
  [key: string]: () => React.ReactNode;
}

const stepComponents: StepComponentMap = {
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

export default function StepPage({ params }: { params: { step: string } }) {
  const Component = stepComponents[params.step];

  if (!Component) return notFound();

  return <Component />;
}
