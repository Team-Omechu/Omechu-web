import AllergyStep from "@/entities/mypage/ui/AllergyStep";
import ConditionStep from "@/entities/mypage/ui/ConditionStep";
import EditStart from "@/entities/mypage/ui/EditStart";
import FoodStep from "@/entities/mypage/ui/FoodStep";
import GenderStep from "@/entities/mypage/ui/GenderStep";
import StateStep from "@/entities/mypage/ui/StateStep";

// 타입/데이터는 shared에서 re-export
export {
  type StepKey,
  stepOrder,
  slugToIndex,
  indexToSlug,
} from "@/shared/config/userInfoEditSteps";

import type { StepKey } from "@/shared/config/userInfoEditSteps";

// 각 스텝별 컴포넌트를 타입으로 명시 (widgets에서만 사용)
export const stepComponents: Record<StepKey, () => React.ReactNode> = {
  start: EditStart,
  gender: GenderStep,
  exercise: StateStep,
  prefer: FoodStep,
  body_type: ConditionStep,
  allergy: AllergyStep,
};
