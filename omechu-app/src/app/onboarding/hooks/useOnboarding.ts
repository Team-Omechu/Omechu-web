"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import * as onboardingApi from "@/onboarding/api/onboarding";
import { useAuthStore } from "@/auth/store";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

export const useOnboarding = () => {
  const router = useRouter();
  const {
    nickname,
    profileImageUrl,
    gender,
    constitution,
    workoutStatus,
    preferredFood,
    allergies,
    reset: resetOnboarding,
  } = useOnboardingStore();
  const { user: authUser, login } = useAuthStore();

  const { mutate: completeOnboarding, isPending: isCompleting } = useMutation<
    onboardingApi.OnboardingSuccessData,
    Error,
    onboardingApi.OnboardingRequestData
  >({
    mutationFn: onboardingApi.completeOnboarding,
    onSuccess: (completedProfile) => {
      if (authUser) {
        login({
          accessToken: "", // 토큰은 로그인 시 별도 관리되므로 빈 값으로 전달
          user: completedProfile,
        });
      }
      router.push("/onboarding/complete"); // 완료 페이지로 이동
    },
    // onError는 페이지에서 직접 처리하도록 prop으로 전달받을 수 있습니다.
  });

  const submitOnboardingData = () => {
    const dataToSubmit: onboardingApi.OnboardingRequestData = {
      nickname: nickname,
      profileImageUrl: profileImageUrl || "",
      gender: gender,
      body_type: constitution.length > 0 ? constitution[0] : null,
      state: workoutStatus,
      prefer: preferredFood || [],
      allergy: allergies || [],
    };
    completeOnboarding(dataToSubmit);
  };

  return {
    submitOnboardingData,
    isCompleting,
    resetOnboarding,
  };
};
