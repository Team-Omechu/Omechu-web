"use client";

import { ListButton, useOnboardingStore } from "@/shared";

import OnboardingStepLayout from "./OnboardingStepLayout";

const PreferStep = () => {
  const { prefer, togglePrefer } = useOnboardingStore();
  const options = ["한식", "양식", "중식", "일식", "다른나라 음식"];

  return (
    <OnboardingStepLayout title={"평소 자주 먹거나 좋아하는 \n 음식이 있나요?"}>
      {options.map((option) => (
        <ListButton
          key={option}
          onClick={() => togglePrefer(option)}
          isSelected={prefer.includes(option)}
        >
          {option}
        </ListButton>
      ))}
    </OnboardingStepLayout>
  );
};

export default PreferStep;
