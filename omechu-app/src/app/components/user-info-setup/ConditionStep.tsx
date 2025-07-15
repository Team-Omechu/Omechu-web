"use client";

import React from "react";

import { useUserInfoSetupStore } from "@/lib/stores/userInfoSetup.store";

import UserInfoSetupButton from "./UserInfoSetupButton";
import UserInfoSetupLayout from "./UserInfoSetupLayout";

const ConditionStep = () => {
  const { constitution, toggleConstitution } = useUserInfoSetupStore();
  const options = [
    "감기에 잘 걸리는 편이에요",
    "소화가 잘 안 되는 날이 많아요",
    "열이 많아서 더위를 잘 타요",
    "추위를 잘 타고 몸이 쉽게 차가워져요",
  ];

  return (
    <UserInfoSetupLayout title="체질은 무엇인가요?" paddingClassName="px-0">
      {options.map((option) => (
        <UserInfoSetupButton
          key={option}
          onClick={() => toggleConstitution(option)}
          isSelected={constitution.includes(option)}
        >
          {option}
        </UserInfoSetupButton>
      ))}
    </UserInfoSetupLayout>
  );
};

export default ConditionStep;
