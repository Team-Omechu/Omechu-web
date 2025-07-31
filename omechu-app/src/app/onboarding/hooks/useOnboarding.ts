"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import * as onboardingApi from "@/onboarding/api/onboarding";
import { useAuthStore } from "@/auth/store";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import type { LoginSuccessData } from "@/lib/api/auth";

const PREFER_MAP: Record<string, string> = {
  한식: "korean",
  양식: "western",
  중식: "chinese",
  일식: "japanese",
  다른나라: "other",
};

const ALLERGY_MAP: Record<string, string> = {
  "달걀(난류) 알레르기": "egg",
  "우유 알레르기": "milk",
  "갑각류 알레르기": "shellfish",
  "해산물 알레르기": "seafood",
  "견과류 알레르기": "nuts",
};

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
      const userForAuthStore: LoginSuccessData = {
        ...completedProfile,
        gender: completedProfile.gender,
        state: completedProfile.state,
      };

      if (authUser) {
        login({
          accessToken: "",
          user: userForAuthStore,
        });
      }
      router.push("/onboarding/complete");
    },
  });

  const submitOnboardingData = () => {
    const dataToSubmit: onboardingApi.OnboardingRequestData = {
      nickname: nickname,
      profileImageUrl: profileImageUrl || "",
      gender: gender,
      body_type: constitution.length > 0 ? constitution[0] : null,
      state: workoutStatus,
      prefer: preferredFood.map((food) => PREFER_MAP[food] || food),
      allergy: allergies.map((item) => ALLERGY_MAP[item] || item),
    };
    completeOnboarding(dataToSubmit);
  };

  return {
    submitOnboardingData,
    isCompleting,
    resetOnboarding,
  };
};
