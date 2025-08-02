/* eslint-disable @next/next/no-img-element */
"use client";
import { useRef } from "react";

interface Props {
  imagePreview: string | null;
  profileImageUrl: string | null;
  onImageChange: (file: File, previewUrl: string) => void;
  onImageDelete: () => void;
}

export default function ProfileImageUploader({
  imagePreview,
  profileImageUrl,
  onImageChange,
  onImageDelete,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onImageChange(file, previewUrl);
    }
  };

  return (
    <div className="relative px-3">
      <div className="mb-3">
        <img
          src={
            imagePreview
              ? imagePreview
              : profileImageUrl
                ? profileImageUrl
                : "/profile/profile_default_img_rotated.svg"
          }
          width={73}
          height={73}
          alt="프로필 이미지"
        />
      </div>
      <button className="absolute right-1 top-1" onClick={handleImageClick}>
        <img src="/profile/camera.svg" alt="upload" width={25} height={20} />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button
        className="ml-1 text-center text-sm font-normal text-[#48528E]"
        onClick={onImageDelete}
      >
        사진지우기
      </button>
    </div>
  );
}
