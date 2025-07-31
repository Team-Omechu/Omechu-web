"use client";

import React from "react";

import ListButton from "@/components/common/button/ListButton";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

import OnboardingStepLayout from "./OnboardingStepLayout";

const options = ["다이어트 중", "증량 중", "유지 중"];

const WorkoutStatusStep = () => {
  const { workoutStatus, setWorkoutStatus } = useOnboardingStore();

  return (
    <OnboardingStepLayout title={"지금 어떤 운동 상태에 \n 가까운가요?"}>
      {options.map((option) => (
        <ListButton
          key={option}
          onClick={() =>
            setWorkoutStatus(option as "다이어트 중" | "증량 중" | "유지 중")
          }
          isSelected={workoutStatus === option}
        >
          {option}
        </ListButton>
      ))}
    </OnboardingStepLayout>
  );
};

export default WorkoutStatusStep;
