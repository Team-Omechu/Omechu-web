"use client";

import React from "react";

import { ListButton, useOnboardingStore } from "@/shared";

import OnboardingStepLayout from "./OnboardingStepLayout";

const ExerciseStep = () => {
  const { exercise, setExercise } = useOnboardingStore();
  const options = ["다이어트 중", "증량 중", "유지 중"];

  return (
    <OnboardingStepLayout title={"지금 어떤 운동 상태에 \n 가까운가요?"}>
      {options.map((option) => (
        <ListButton
          key={option}
          onClick={() => setExercise(option)}
          isSelected={exercise === option}
        >
          {option}
        </ListButton>
      ))}
    </OnboardingStepLayout>
  );
};

export default ExerciseStep;
