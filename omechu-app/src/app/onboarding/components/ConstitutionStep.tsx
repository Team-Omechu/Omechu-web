"use client";

import React from "react";

import ListButton from "@/app/components/common/button/ListButton";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

import OnboardingStepLayout from "./OnboardingStepLayout";

const ConstitutionStep = () => {
  const { constitution, toggleConstitution } = useOnboardingStore();
  const options = [
    "감기에 잘 걸리는 편이에요",
    "소화가 잘 안 되는 날이 많아요",
    "열이 많아서 더위를 잘 타요",
    "추위를 잘 타고 몸이 쉽게 차가워져요",
  ];

  return (
    <OnboardingStepLayout title="체질은 무엇인가요?" paddingClassName="px-0">
      {options.map((option) => (
        <ListButton
          key={option}
          onClick={() => toggleConstitution(option)}
          isSelected={constitution.includes(option)}
          textSize="base"
        >
          {option}
        </ListButton>
      ))}
    </OnboardingStepLayout>
  );
};

export default ConstitutionStep;
