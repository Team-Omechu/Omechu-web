"use client";

import React from "react";

import ListButton from "@/components/common/button/ListButton";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

import OnboardingStepLayout from "./OnboardingStepLayout";

// UI에 표시될 텍스트(label)와 서버로 보낼 값(value)을 매핑합니다.
const CONSTITUTIONS = [
  { label: "감기에 잘 걸리는 편이에요", value: "감기" },
  { label: "소화가 잘 안 되는 날이 많아요", value: "소화불량" },
  { label: "열이 많아서 더위를 잘 타요", value: "더위잘탐" },
  { label: "추위를 잘 타고 몸이 쉽게 차가워져요", value: "추위잘탐" },
];

const ConstitutionStep = () => {
  const { constitution, toggleConstitution } = useOnboardingStore();

  return (
    // 사용자님이 알려주신 디자인 속성을 모두 적용합니다.
    <OnboardingStepLayout title="체질은 무엇인가요?" paddingClassName="px-0">
      {CONSTITUTIONS.map((item) => (
        <ListButton
          key={item.value}
          onClick={() => toggleConstitution(item.value)}
          isSelected={constitution.includes(item.value)}
          // 사용자님이 알려주신 디자인 속성을 적용합니다.
          textSize="base"
        >
          {item.label}
        </ListButton>
      ))}
    </OnboardingStepLayout>
  );
};

export default ConstitutionStep;
