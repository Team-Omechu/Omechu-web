// ============================================
// entities/onboarding 배럴 export
// FSD 규칙: entities는 shared만 의존
// ============================================

// API
export {
  completeOnboarding,
  type OnboardingRequestData,
  type OnboardingSuccessData,
} from "./api/onboarding";

// Model
export { useCompleteOnboardingMutation } from "./model/useOnboarding";
export { useOnboardingStore } from "./model/onboarding.store";

// UI
export { BasicStateForm, BasicFoodForm, BasicAllergyForm } from "./ui";
