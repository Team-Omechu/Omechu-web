"use client";

import React from "react";

import ListButton from "@/components/common/button/ListButton";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

import OnboardingStepLayout from "./OnboardingStepLayout";

const GenderStep = () => {
  const { gender, setGender } = useOnboardingStore();

  const handleGenderSelect = (selectedGender: "여자" | "남자") => {
    setGender(selectedGender);
  };

  return (
    <OnboardingStepLayout title="성별은 무엇인가요?">
      <div className="flex w-full gap-4">
        <ListButton
          onClick={() => handleGenderSelect("여자")}
          isSelected={gender === "여자"}
        >
          여성
        </ListButton>
        <ListButton
          onClick={() => handleGenderSelect("남자")}
          isSelected={gender === "남자"}
        >
          남성
        </ListButton>
      </div>
    </OnboardingStepLayout>
  );
};

export default GenderStep;
