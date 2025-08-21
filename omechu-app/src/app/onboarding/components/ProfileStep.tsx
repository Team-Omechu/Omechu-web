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
          <h1 className="text-2xl font-normal text-grey-darker">
            프로필을 입력해 주세요
          </h1>
        </div>
        <div className="mb-6 flex flex-col items-center gap-2">
          <button type="button" className="relative" onClick={handleImageClick}>
            <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full">
              <Image
                src={
                  imagePreview ||
                  profileImageUrl ||
                  "/profile/profile_default_img_rotated.svg"
                }
                alt="프로필 사진 선택"
                fill
                sizes="100px"
                className="object-cover"
              />
            </div>
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
            className="text-center text-sm font-normal text-secondary-normal underline"
            onClick={handleImageDelete}
            disabled={isUploading}
          >
            {isUploading ? "업로드 중..." : "사진지우기"}
          </button>
        </div>
        <div className="w-full max-w-xs">
          {/* 공용 Input은 수정하지 않고, 동일 레이아웃을 직접 구현해서
              설명 문구가 에러 시 빨간색으로만 보이도록 처리 */}
          <div className="relative mb-5 flex w-full flex-col">
            <label className="text-normal mb-0.5 ml-0.5 text-sm text-grey-darker">
              닉네임
            </label>
            <div className="flex h-10 items-center gap-1">
              <input
                type="text"
                value={nickname}
                placeholder="닉네임을 입력해주세요"
                onChange={(e) => handleNicknameChange(e.target.value)}
                className="h-full w-full rounded-md border-[1px] border-grey-darkHover pl-4 pt-0.5 text-sm font-normal text-grey-darker placeholder:text-sm placeholder:text-grey-normalActive"
              />
            </div>
            <span
              className={`ml-1 mt-1 text-sm font-normal ${
                isInvalid ? "text-primary-normal" : "text-grey-normalActive"
              }`}
            >
              한영문자 2-12글자로 입력해주세요
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileStep;
