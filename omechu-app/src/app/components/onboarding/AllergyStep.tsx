"use client";

import React from "react";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import OnboardingButton from "./OnboardingButton";
import OnboardingStepLayout from "./OnboardingStepLayout";

const AllergyStep = () => {
  const { allergies, toggleAllergy } = useOnboardingStore();
  const options = [
    "달걀(난류) 알레르기",
    "우유 알레르기",
    "갑각류 알레르기",
    "해산물",
    "견과류",
  ];

  return (
    <OnboardingStepLayout title="알레르기가 있나요?">
      {options.map((option) => (
        <OnboardingButton
          key={option}
          onClick={() => toggleAllergy(option)}
          isSelected={allergies.includes(option)}
        >
          {option}
        </OnboardingButton>
      ))}
    </OnboardingStepLayout>
  );
};

export default AllergyStep;
