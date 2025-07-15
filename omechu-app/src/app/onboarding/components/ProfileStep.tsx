"use client";

import React from "react";

import Image from "next/image";

import Input from "@/app/auth/components/Input";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

const ProfileStep = () => {
  const { nickname, setNickname } = useOnboardingStore();
  const isInvalid =
    nickname.length > 0 && (nickname.length < 2 || nickname.length > 12);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  return (
    <div className="flex w-full flex-col items-center px-4 py-6">
      <section className="my-20">
        <div className="whitespace-pre p-10 text-center text-3xl font-medium leading-relaxed">
          <div className="text-center text-2xl font-semibold text-[#1F9BDA]">
            반가워요!
          </div>
          <h1 className="text-2xl font-normal text-black">
            프로필을 입력해 주세요
          </h1>
        </div>
        <div className="mb-6 flex flex-col items-center gap-2">
          <button type="button" className="relative">
            <Image
              src="/onboarding-restaurant-icon.png"
              alt="프로필 사진 선택"
              width={100}
              height={100}
            />
            <div className="absolute right-0 top-0">
              <Image
                src="/camera_Icon.png"
                alt="이미지 업로드"
                width={30}
                height={30}
              />
            </div>
          </button>
          <button
            type="button"
            className="text-center text-sm font-normal text-[#48528E] dark:text-[#e9f5fb]"
          >
            사진지우기
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
        <div className="flex flex-col gap-2 text-sm text-[#828282]">
          한영문자 2-12글자로 입력해주세요
        </div>
      </section>
    </div>
  );
};

export default ProfileStep;
