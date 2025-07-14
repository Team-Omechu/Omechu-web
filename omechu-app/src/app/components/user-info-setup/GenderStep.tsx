"use client";

import React from "react";

import { useUserInfoSetupStore } from "@/lib/stores/userInfoSetup.store";

import UserInfoSetupButton from "./UserInfoSetupButton";
import UserInfoSetupLayout from "./UserInfoSetupLayout";

const GenderStep = () => {
  const { gender, setGender } = useUserInfoSetupStore();

  return (
    <UserInfoSetupLayout title="성별은 무엇인가요?">
      <div className="flex w-full gap-4">
        <UserInfoSetupButton
          onClick={() => setGender("여성")}
          isSelected={gender === "여성"}
          className="text-xl"
        >
          여성
        </UserInfoSetupButton>
        <UserInfoSetupButton
          onClick={() => setGender("남성")}
          isSelected={gender === "남성"}
          className="text-xl"
        >
          남성
        </UserInfoSetupButton>
      </div>
    </UserInfoSetupLayout>
  );
};

export default GenderStep;
