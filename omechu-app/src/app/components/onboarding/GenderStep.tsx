"use client";

import React from "react";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import OnboardingButton from "./OnboardingButton";
import OnboardingStepLayout from "./OnboardingStepLayout";

const GenderStep = () => {
  const { gender, setGender } = useOnboardingStore();

  const handleGenderSelect = (selectedGender: "여성" | "남성") => {
    setGender(selectedGender);
  };

  return (
    <OnboardingStepLayout title="성별은 무엇인가요?">
      <div className="flex w-full gap-4">
        <OnboardingButton
          onClick={() => handleGenderSelect("여성")}
          isSelected={gender === "여성"}
        >
          여성
        </OnboardingButton>
        <OnboardingButton
          onClick={() => handleGenderSelect("남성")}
          isSelected={gender === "남성"}
        >
          남성
        </OnboardingButton>
      </div>
    </OnboardingStepLayout>
  );
};

export default GenderStep;
