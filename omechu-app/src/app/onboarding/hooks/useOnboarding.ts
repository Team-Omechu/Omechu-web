"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import * as onboardingApi from "@/onboarding/api/onboarding";
import { useAuthStore } from "@/auth/store";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
// LoginSuccessData 는 auth.store.ts 에서 user 타입으로 이미 사용되고 있으므로,
// auth.store.ts 에서 직접 가져오도록 수정합니다.
import type { LoginSuccessData } from "@/lib/api/auth";

const genderToDbValue = (
  gender: "남성" | "여성" | null,
): "MALE" | "FEMALE" | null => {
  if (gender === "남성") return "MALE";
  if (gender === "여성") return "FEMALE";
  return null;
};

const workoutStatusToDbValue = (
  status: "다이어트 중" | "증량 중" | "유지 중" | null,
): "DIET" | "BULK_UP" | "MAINTAIN" | null => {
  if (status === "다이어트 중") return "DIET";
  if (status === "증량 중") return "BULK_UP";
  if (status === "유지 중") return "MAINTAIN";
  return null;
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
    onboardingApi.OnboardingSuccessData, // 1. 실제 반환 타입으로 수정
    Error,
    onboardingApi.OnboardingRequestData
  >({
    mutationFn: onboardingApi.completeOnboarding,
    onSuccess: (completedProfile) => {
      // 2. 받은 데이터를 Auth 스토어의 user 타입에 맞게 변환
      const userForAuthStore: LoginSuccessData = {
        ...completedProfile,
        gender: completedProfile.gender === "MALE" ? "남성" : "여성",
        state:
          completedProfile.state === "DIET"
            ? "다이어트 중"
            : completedProfile.state === "BULK_UP"
              ? "증량 중"
              : "유지 중",
      };

      if (authUser) {
        login({
          accessToken: "", // 토큰은 로그인 시 별도 관리되므로 빈 값으로 전달
          user: userForAuthStore, // 3. 변환된 데이터를 login 함수에 전달
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
      gender: genderToDbValue(gender),
      body_type: constitution.length > 0 ? constitution[0] : null,
      state: workoutStatusToDbValue(workoutStatus),
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
