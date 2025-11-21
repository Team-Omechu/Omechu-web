import AllergyStep from "@/entities_FSD/mypage/ui/AllergyStep";
import ConditionStep from "@/entities_FSD/mypage/ui/ConditionStep";
import EditStart from "@/entities_FSD/mypage/ui/EditStart";
import FoodStep from "@/entities_FSD/mypage/ui/FoodStep";
import GenderStep from "@/entities_FSD/mypage/ui/GenderStep";
import StateStep from "@/entities_FSD/mypage/ui/StateStep";
import { notFound } from "next/navigation";

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
