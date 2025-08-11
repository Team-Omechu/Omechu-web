"use client";

import React, { useRef, useState } from "react";

import Image from "next/image";

import Input from "@/components/common/Input";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { getPresignedUrl, uploadToS3 } from "@/lib/api/image";

const ProfileStep = () => {
  const { nickname, setNickname, profileImageUrl, setProfileImageUrl } =
    useOnboardingStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isInvalid =
    nickname.length > 0 && (nickname.length < 2 || nickname.length > 12);

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    try {
      setIsUploading(true);
      const { uploadUrl, fileUrl } = await getPresignedUrl(
        file.name,
        file.type,
        "profile",
      );
      await uploadToS3(uploadUrl, file, { acl: "public-read" });
      setProfileImageUrl(fileUrl);
    } catch (err) {
      console.error("이미지 업로드 실패", err);
    } finally {
      setIsUploading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageDelete = () => {
    setImagePreview(null);
    setProfileImageUrl("");
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
          <button type="button" className="relative" onClick={handleImageClick}>
            <Image
              src={
                imagePreview ||
                profileImageUrl ||
                "/profile/profile_default_img_rotated.svg"
              }
              alt="프로필 사진 선택"
              width={100}
              height={100}
            />
            <div className="absolute right-0 top-0">
              <Image
                src="/profile/camera.svg"
                alt="이미지 업로드"
                width={30}
                height={30}
              />
            </div>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="text-center text-sm font-normal text-[#48528E] underline dark:text-[#48528E]"
            onClick={handleImageDelete}
            disabled={isUploading}
          >
            {isUploading ? "업로드 중..." : "사진지우기"}
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
