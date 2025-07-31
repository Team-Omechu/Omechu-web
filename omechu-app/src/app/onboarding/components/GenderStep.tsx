"use client";

import React from "react";

import ListButton from "@/components/common/button/ListButton";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

import OnboardingStepLayout from "./OnboardingStepLayout";

const GenderStep = () => {
  const { gender, setGender } = useOnboardingStore();

  return (
    <OnboardingStepLayout title="성별은 무엇인가요?">
      <div className="flex w-full gap-4">
        <ListButton
          onClick={() => setGender("여성")}
          isSelected={gender === "여성"}
        >
          여성
        </ListButton>
        <ListButton
          onClick={() => setGender("남성")}
          isSelected={gender === "남성"}
        >
          남성
        </ListButton>
      </div>
    </OnboardingStepLayout>
  );
};

export default GenderStep;
