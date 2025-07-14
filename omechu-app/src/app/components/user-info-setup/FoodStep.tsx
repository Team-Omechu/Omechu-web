"use client";

import React from "react";
import { useUserInfoSetupStore } from "@/lib/stores/userInfoSetup.store";
import UserInfoSetupButton from "./UserInfoSetupButton";
import UserInfoSetupLayout from "./UserInfoSetupLayout";

const FoodStep = () => {
  const { preferredFood, togglePreferredFood } = useUserInfoSetupStore();
  const options = ["한식", "양식", "중식", "일식", "다른나라 음식"];

  return (
    <UserInfoSetupLayout title={"평소 자주 먹거나 좋아하는\n음식이 있나요?"}>
      {options.map((option) => (
        <UserInfoSetupButton
          key={option}
          onClick={() => togglePreferredFood(option)}
          isSelected={preferredFood.includes(option)}
        >
          {option}
        </UserInfoSetupButton>
      ))}
    </UserInfoSetupLayout>
  );
};

export default FoodStep;
