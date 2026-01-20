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

// UI

export { default as OnboardingStepLayout } from "./ui/OnboardingStepLayout";
export { default as PreferStep } from "./ui/PreferStep";
export { default as ProfileStep } from "./ui/ProfileStep";
