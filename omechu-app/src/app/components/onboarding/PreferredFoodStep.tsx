"use client";

import React from "react";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import OnboardingButton from "./OnboardingButton";
import OnboardingStepLayout from "./OnboardingStepLayout";

const PreferredFoodStep = () => {
  const { preferredFood, togglePreferredFood } = useOnboardingStore();
  const options = ["한식", "양식", "중식", "일식", "다른나라 음식"];

  return (
    <OnboardingStepLayout title={"평소 자주 먹거나 좋아하는 \n 음식이 있나요?"}>
      {options.map((option) => (
        <OnboardingButton
          key={option}
          onClick={() => togglePreferredFood(option)}
          isSelected={preferredFood.includes(option)}
        >
          {option}
        </OnboardingButton>
      ))}
    </OnboardingStepLayout>
  );
};

export default PreferredFoodStep;
