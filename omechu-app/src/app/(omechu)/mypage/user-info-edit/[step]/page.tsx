import AllergyStep from "../../../../../entities/mypage/ui/AllergyStep";
import ConditionStep from "../../../../../entities/mypage/ui/ConditionStep";
import EditStart from "../../../../../entities/mypage/ui/EditStart";
import FoodStep from "../../../../../entities/mypage/ui/FoodStep";
import GenderStep from "../../../../../entities/mypage/ui/GenderStep";
import StateStep from "../../../../../entities/mypage/ui/StateStep";
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
