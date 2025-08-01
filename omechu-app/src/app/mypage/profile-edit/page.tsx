"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";

import { useProfile } from "../hooks/useProfile";
import {
  getPresignedUrl,
  uploadToS3,
  updateProfile,
} from "../api/updateProfile";
import { useAuthStore } from "@/auth/store";
import { LoadingSpinner } from "@/components/common/LoadingIndicator";

export default function ProfileEdit() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [nickname, setNickname] = useState(""); // 기본값 설정
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const nicknameRegex = /^[A-Za-z가-힣]{2,12}$/; // 2~12글자, 한글/영문만 허용

  // 전역 상태에서 user 객체 가져오기
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ? Number(user.id) : undefined; // id가 string이면 변환, number면 그대로
  const { profile, loading, error } = useProfile();
  const [minLoading, setMinLoading] = useState(true);

  // 상태와 동기화 (처음 한 번만)
  useEffect(() => {
    if (profile) {
      setProfileImageUrl(profile.profileImageUrl ?? null);
      setNickname(profile.nickname ?? "");
    }
  }, [profile]);

  useEffect(() => {
    setIsValid(nicknameRegex.test(nickname));
  }, [nickname]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setMinLoading(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setMinLoading(false);
    }
  }, [loading]);

  if (loading || minLoading) {
    return <LoadingSpinner label="프로필 정보 불러오는 중..." />;
  }

  const handleSave = async () => {
    if (!userId) return; // 안전 장치
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

  const handleImageClick = () => {
    fileInputRef.current?.click(); // 숨겨진 input 클릭 유도
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    setProfileImageFile(null);
    setProfileImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // 실제 input 비우기
    }
  };

  return (
    <>
      <Header
        title={"프로필 관리"}
        leftChild={
          <button
            onClick={() => {
              router.push("/mypage");
            }}
          >
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={22}
            />
          </button>
        }
      />
      <main className="relative flex h-[calc(100dvh-3rem)] w-full flex-col items-center px-4 py-32">
        <section className="mt-24 flex h-44 items-center justify-center gap-10">
          <div className="relative px-3">
            <div className="mb-3">
              <Image
                src={
                  imagePreview
                    ? imagePreview
                    : !!profileImageUrl
                      ? profileImageUrl
                      : "/profile/profile_default_img_rotated.svg"
                }
                alt="changeProfileImage"
                width={73}
                height={73}
                priority
                onError={() => setProfileImageUrl(null)}
              />
            </div>
            <button
              className="absolute right-1 top-1"
              onClick={handleImageClick}
            >
              <Image
                src="/profile/camera.svg"
                alt="uploadingImage"
                width={25}
                height={20}
              />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button
              className="ml-1 text-center text-sm font-normal text-[#48528E] dark:text-secondary-light"
              onClick={handleDeleteImage}
            >
              사진지우기
            </button>
          </div>
          <div className="mb-8 flex flex-col items-start gap-1">
            <div className="ml-1 text-lg font-medium text-grey-darker dark:text-grey-lightHover">
              닉네임
            </div>
            <div className="relative">
              <input
                className="h-9 w-44 rounded-md border-[1px] border-grey-darkHover px-2.5 py-2.5 text-base text-grey-darker placeholder:text-sm"
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
                placeholder="닉네임을 입력해주세요"
              />
              <button
                className="absolute right-2 top-2"
                onClick={() => setNickname("")}
              >
                <Image
                  src={"/x/cancel.svg"}
                  alt={"초기화"}
                  width={20}
                  height={15}
                />
              </button>
            </div>
            <span
              className={`ml-1 mt-0.5 text-xs font-normal ${isValid ? "text-grey-normalActive" : "text-primary-normalActive"}`}
            >
              한영문자 2-12글자로 입력해주세요
            </span>
          </div>
        </section>
        <section className="mt-28">
          <button
            onClick={handleSave}
            disabled={!isValid || isLoading}
            className={`h-12 w-[335px] rounded-md text-lg font-medium text-white ${isValid ? "bg-primary-normal hover:bg-primary-normalHover active:bg-primary-normalActive" : "cursor-not-allowed bg-grey-normal"}`}
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
      {/* {error && (
        <ModalWrapper>
          <AlertModal
            title="로그인이 필요합니다"
            description="로그인 후 이용해 주세요."
            confirmText="확인"
            onConfirm={() => {
              router.push("/sign-in");
            }}
          />
        </ModalWrapper>
      )} */}
    </>
  );
}
