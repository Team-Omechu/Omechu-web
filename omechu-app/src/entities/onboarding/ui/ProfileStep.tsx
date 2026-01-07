"use client";

import React, { useRef, useState } from "react";

import Image from "next/image";

import { useOnboardingStore, getPresignedUrl, uploadToS3 } from "@/shared";

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
        <div className="p-10 text-center text-3xl leading-relaxed font-medium whitespace-pre">
          <div className="text-secondary-normal text-center text-2xl font-semibold">
            반가워요!
          </div>
          <h1 className="text-grey-darker text-2xl font-normal">
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
            <div className="absolute top-0 right-0">
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
            className="text-secondary-normal text-center text-sm font-normal underline"
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
            <label className="text-normal text-grey-darker mb-0.5 ml-0.5 text-sm">
              닉네임
            </label>
            <div className="flex h-10 items-center gap-1">
              <input
                type="text"
                value={nickname}
                placeholder="닉네임을 입력해주세요"
                onChange={(e) => handleNicknameChange(e.target.value)}
                className="border-grey-dark-hover text-grey-darker placeholder:text-grey-normal-active h-full w-full rounded-md border pt-0.5 pl-4 text-sm font-normal placeholder:text-sm"
              />
            </div>
            <span
              className={`mt-1 ml-1 text-sm font-normal ${
                isInvalid ? "text-primary-normal" : "text-grey-normal-active"
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
