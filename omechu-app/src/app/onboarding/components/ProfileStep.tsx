"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

import Input from "@/components/common/Input";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { getPresignedUrl, uploadImageToS3 } from "@/lib/api/image";

const ProfileStep = () => {
  const { nickname, setNickname, profileImageUrl, setProfileImageUrl } =
    useOnboardingStore();
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isInvalid =
    nickname.length > 0 && (nickname.length < 2 || nickname.length > 12);

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const handleImageUploadClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageRemove = () => {
    setProfileImageUrl(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("JPEG 또는 PNG 파일만 업로드할 수 있습니다.");
      return;
    }

    setIsUploading(true);
    try {
      const { uploadUrl, fileUrl } = await getPresignedUrl("profile");
      await uploadImageToS3(uploadUrl, file);
      setProfileImageUrl(fileUrl);
    } catch (error) {
      console.error("이미지 업로드에 실패했습니다.", error);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center px-4 py-6">
      <section className="my-20">
        <div className="whitespace-pre p-10 text-center text-3xl font-medium leading-relaxed">
          <div className="text-center text-2xl font-semibold text-secondary-normal">
            반가워요!
          </div>
          <h1 className="text-2xl font-normal text-black">
            프로필을 입력해 주세요
          </h1>
        </div>
        <div className="mb-6 flex flex-col items-center gap-2">
          <button
            type="button"
            className="relative flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-100"
            onClick={handleImageUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="text-sm text-gray-500">업로드 중...</div>
            ) : (
              <Image
                src={
                  profileImageUrl || "/profile/profile_default_img_rotated.svg"
                }
                alt="프로필 사진 선택"
                fill
                className="rounded-full object-cover"
                priority
              />
            )}
            {!isUploading && (
              <div className="absolute bottom-0 right-0">
                <Image
                  src="/profile/camera.svg"
                  alt="이미지 업로드"
                  width={30}
                  height={30}
                />
              </div>
            )}
          </button>
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg"
          />
          <button
            type="button"
            onClick={handleImageRemove}
            className="text-center text-sm font-normal text-[#48528E] disabled:text-gray-400 dark:text-secondary-light"
            disabled={!profileImageUrl || isUploading}
          >
            사진지우기
          </button>
        </div>
        <div className="w-full max-w-xs">
          <Input
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={handleNicknameChange}
            showError={isInvalid}
            errorMessage="한영문자 2-12글자로 입력해주세요"
            description="한영문자 2-12글자로 입력해주세요"
          />
        </div>
      </section>
    </div>
  );
};

export default ProfileStep;
