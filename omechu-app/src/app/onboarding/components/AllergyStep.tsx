"use client";

import React from "react";

import ListButton from "@/app/components/common/button/ListButton";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

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
        <ListButton
          key={option}
          onClick={() => toggleAllergy(option)}
          isSelected={allergies.includes(option)}
        >
          {option}
        </ListButton>
      ))}
    </OnboardingStepLayout>
  );
};

export default AllergyStep;
