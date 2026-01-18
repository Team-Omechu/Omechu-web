"use client";

import { ListButton, useOnboardingStore } from "@/shared";

import OnboardingStepLayout from "./OnboardingStepLayout";

const GenderStep = () => {
  const { gender, setGender } = useOnboardingStore();

  const handleGenderSelect = (selectedGender: "남성" | "여성") => {
    setGender(selectedGender);
  };

  return (
    <OnboardingStepLayout title="성별은 무엇인가요?">
      <div className="flex w-full gap-4">
        <ListButton
          onClick={() => handleGenderSelect("여성")}
          isSelected={gender === "여성"}
        >
          여성
        </ListButton>
        <ListButton
          onClick={() => handleGenderSelect("남성")}
          isSelected={gender === "남성"}
        >
          남성
        </ListButton>
      </div>
    </OnboardingStepLayout>
  );
};

export default GenderStep;
