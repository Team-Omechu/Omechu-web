import { notFound } from "next/navigation";

import {
  AllergyStep,
  ConditionStep,
  EditStart,
  FoodStep,
  GenderStep,
  StateStep,
} from "@/entities/mypage";

const stepComponents = {
  gender: GenderStep,
  state: StateStep,
  food: FoodStep,
  condition: ConditionStep,
  allergy: AllergyStep,
  start: EditStart,
};

interface Params {
  step: keyof typeof stepComponents;
}

export default function UserInfoEditStepPage({ params }: { params: Params }) {
  const { step } = params;

  const StepComponent = stepComponents[step];

  if (!StepComponent) return notFound();

  return <StepComponent />;
}
