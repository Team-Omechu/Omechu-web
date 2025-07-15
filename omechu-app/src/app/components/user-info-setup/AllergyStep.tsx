"use client";

import React from "react";

import { useUserInfoSetupStore } from "@/lib/stores/userInfoSetup.store";

import UserInfoSetupButton from "./UserInfoSetupButton";
import UserInfoSetupLayout from "./UserInfoSetupLayout";

const AllergyStep = () => {
  const { allergies, toggleAllergy } = useUserInfoSetupStore();
  const options = ["달걀 (난류)", "유제품", "갑각류", "해산물", "견과류"];

  return (
    <UserInfoSetupLayout title="알레르기가 있나요?">
      {options.map((option) => (
        <UserInfoSetupButton
          key={option}
          onClick={() => toggleAllergy(option)}
          isSelected={allergies.includes(option)}
        >
          {option}
        </UserInfoSetupButton>
      ))}
    </UserInfoSetupLayout>
  );
};

export default AllergyStep;
