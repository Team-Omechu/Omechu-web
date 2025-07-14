"use client";

import React from "react";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import OnboardingButton from "./OnboardingButton";
import OnboardingStepLayout from "./OnboardingStepLayout";

const WorkoutStatusStep = () => {
  const { workoutStatus, setWorkoutStatus } = useOnboardingStore();
  const options = ["다이어트 중", "증량 중", "유지 중"];

  return (
    <OnboardingStepLayout title={"지금 어떤 운동 상태에 \n 가까운가요?"}>
      {options.map((option) => (
        <OnboardingButton
          key={option}
          onClick={() => setWorkoutStatus(option)}
          isSelected={workoutStatus === option}
        >
          {option}
        </OnboardingButton>
      ))}
    </OnboardingStepLayout>
  );
};

export default WorkoutStatusStep;
