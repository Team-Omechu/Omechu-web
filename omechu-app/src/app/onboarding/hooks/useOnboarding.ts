import { useMutation } from "@tanstack/react-query";

import * as onboardingApi from "@/onboarding/api/onboarding";

/**
 * 온보딩 완료(회원가입 완료) API를 호출하는 커스텀 훅
 */
export const useCompleteOnboardingMutation = () => {
  return useMutation<
    onboardingApi.OnboardingSuccessData,
    Error,
    onboardingApi.OnboardingRequestData
  >({
    mutationFn: onboardingApi.completeOnboarding,
  });
};
