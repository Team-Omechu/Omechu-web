"use client";

import React from "react";
import Image from "next/image";
import Input from "@/app/components/auth/Input";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

const ProfileStep = () => {
  const { nickname, setNickname } = useOnboardingStore();
  const isInvalid =
    nickname.length > 0 && (nickname.length < 2 || nickname.length > 12);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  return (
    <div className="flex flex-col items-center w-full h-full px-5">
      <div className="flex flex-col items-center w-full gap-10 pt-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-500">반가워요!</p>
          <h1 className="text-2xl font-bold">프로필을 입력해 주세요</h1>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-[73px] h-[73px] mb-2">
            <Image
              src="/onboarding-restaurant-icon.png"
              alt="Profile"
              width={73}
              height={73}
              className="object-cover"
            />
          </div>
          <button className="text-sm text-gray-500 hover:underline">
            사진 지우기
          </button>
        </div>
        <div className="w-full max-w-xs">
          <Input
            label="닉네임"
            name="nickname"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={handleNicknameChange}
            error={isInvalid ? "한영문자 2-12글자로 입력해주세요" : ""}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileStep;
