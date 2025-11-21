import { notFound } from "next/navigation";

import AllergyStep from "@/entities_FSD/mypage/ui/AllergyStep";
import ConditionStep from "@/entities_FSD/mypage/ui/ConditionStep";
import EditStart from "@/entities_FSD/mypage/ui/EditStart";
import FoodStep from "@/entities_FSD/mypage/ui/FoodStep";
import GenderStep from "@/entities_FSD/mypage/ui/GenderStep";
import StateStep from "@/entities_FSD/mypage/ui/StateStep";

const stepComponents = {
  gender: GenderStep,
  state: StateStep,
  food: FoodStep,
  condition: ConditionStep,
  allergy: AllergyStep,
  start: EditStart,
};

export default function UserInfoEditStepPage({
  params,
}: {
  params: { step: keyof typeof stepComponents };
}) {
  const { step } = params;

  const StepComponent = stepComponents[step];

  if (!StepComponent) return notFound();

  return <StepComponent />;
}
