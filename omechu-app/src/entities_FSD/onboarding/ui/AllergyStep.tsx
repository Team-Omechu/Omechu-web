"use client";

import React from "react";

import ListButton from "@/components/common/button/ListButton";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

import OnboardingStepLayout from "@/entities_FSD/onboarding/ui/OnboardingStepLayout";

const AllergyStep = () => {
  const { allergy, toggleAllergy } = useOnboardingStore();
  // Figma UI와 백엔드 DTO에 맞춰 옵션 텍스트만 수정합니다.
  const options = [
    "달걀(난류) 알레르기",
    "우유 알레르기",
    "갑각류 알레르기",
    "해산물 알레르기",
    "견과류 알레르기",
  ];

  return (
    <OnboardingStepLayout title="알레르기가 있나요?">
      {/* 원래의 레이아웃 구조를 그대로 유지합니다. */}
      {options.map((option) => (
        <ListButton
          key={option}
          onClick={() => toggleAllergy(option)}
          isSelected={allergy.includes(option)}
        >
          {option}
        </ListButton>
      ))}
    </OnboardingStepLayout>
  );
};

export default AllergyStep;
