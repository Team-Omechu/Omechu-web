"use client";

import React from "react";

import { useUserInfoSetupStore } from "@/lib/stores/userInfoSetup.store";

import UserInfoSetupButton from "./UserInfoSetupButton";
import UserInfoSetupLayout from "./UserInfoSetupLayout";

const StateStep = () => {
  const { exercise, setExercise } = useUserInfoSetupStore();
  const options = ["다이어트 중", "증량 중", "유지 중"];

  return (
    <UserInfoSetupLayout title={"지금 어떤 운동 상태에\n가까운가요?"}>
      {options.map((option) => (
        <UserInfoSetupButton
          key={option}
          onClick={() => setExercise(option)}
          isSelected={exercise === option}
        >
          {option}
        </UserInfoSetupButton>
      ))}
    </UserInfoSetupLayout>
  );
};

export default StateStep;
