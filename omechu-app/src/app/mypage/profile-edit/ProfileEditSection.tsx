"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "../hooks/useProfile";
import {
  getPresignedUrl,
  uploadToS3,
  updateProfile,
} from "../api/updateProfile";
import { useAuthStore } from "@/auth/store";
import ProfileImageUploader from "./ProfileImageUploader";
import NicknameInput from "./NicknameInput";
import ModalWrapper from "@/components/common/ModalWrapper";
import AlertModal from "@/components/common/AlertModal";
import { LoadingSpinner } from "@/components/common/LoadingIndicator";

export default function ProfileEditSection() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { profile, loading } = useProfile();

  // 상태
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 최초 프로필 불러오면 상태 초기화
  useEffect(() => {
    if (profile) {
      setProfileImageUrl(profile.profileImageUrl ?? null);
      setNickname(profile.nickname ?? "");
    }
  }, [profile]);

  // 닉네임 유효성 검증
  useEffect(() => {
    setIsValid(/^[A-Za-z가-힣]{2,12}$/.test(nickname));
  }, [nickname]);

  // 저장
  const handleSave = async () => {
    console.log("디버그용 저장 클릭");
    setIsLoading(true);
    setSaveError(null);
    try {
      let imageUrl = profileImageUrl;
      if (profileImageFile) {
        const { uploadUrl, fileUrl } = await getPresignedUrl(
          profileImageFile.name,
          profileImageFile.type,
        );
        await uploadToS3(uploadUrl, profileImageFile);
        imageUrl = fileUrl;
        setProfileImageUrl(fileUrl);
      }
      await updateProfile({
        nickname,
        ...(imageUrl ? { profileImageUrl: imageUrl } : {}),
      });
      setShowModal(true);
    } catch (e: any) {
      setSaveError("프로필 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        label="프로필 정보 불러오는 중..."
        className="h-[calc(100dvh-3rem)] overflow-y-hidden"
      />
    );
  }

  return (
    <main className="relative flex flex-col items-center overflow-y-auto px-4 py-32 scrollbar-hide">
      <section className="mt-24 flex h-44 items-center justify-center gap-10">
        <ProfileImageUploader
          imagePreview={imagePreview}
          profileImageUrl={profileImageUrl}
          onImageChange={(file, previewUrl) => {
            setProfileImageFile(file);
            setImagePreview(previewUrl);
          }}
          onImageDelete={() => {
            setImagePreview(null);
            setProfileImageFile(null);
            setProfileImageUrl(null);
          }}
        />
        <NicknameInput
          nickname={nickname}
          onChange={setNickname}
          isValid={isValid}
        />
      </section>
      <section className="mt-28">
        <button
          onClick={handleSave}
          disabled={!isValid || isLoading}
          className={`h-12 w-[335px] rounded-md text-lg font-medium text-white ${isValid ? "bg-primary-normal" : "cursor-not-allowed bg-grey-normal"}`}
        >
          {isLoading ? "저장 중..." : "저장"}
        </button>
        {saveError && <div className="mt-2 text-red-500">{saveError}</div>}
      </section>
      {showModal && (
        <ModalWrapper>
          <AlertModal
            title="프로필 변경 완료"
            description="이제 맛집을 찾으러 가볼까요?"
            confirmText="완료"
            onConfirm={() => {
              setShowModal(false);
              router.push("/");
            }}
          />
        </ModalWrapper>
      )}
    </main>
  );
}
