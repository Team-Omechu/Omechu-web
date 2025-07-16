"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import AlertModal from "@/app/components/common/AlertModal";
import Header from "@/app/components/common/Header";
import ModalWrapper from "@/app/components/common/ModalWrapper";

export default function ProfileEdit() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [nickname, setNickname] = useState("제나"); // 기본값 설정
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click(); // 숨겨진 input 클릭 유도
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      console.log("선택된 파일:", file);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
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
              height={30}
            />
          </button>
        }
      />
      <main className="min-h-100dvh relative flex w-full flex-col items-center overflow-y-scroll scroll-smooth px-4">
        <section className="mt-36 flex h-44 items-center justify-center gap-10">
          <div className="relative px-3">
            <div className="mb-3">
              <Image
                src={
                  imagePreview
                    ? imagePreview
                    : "/profile/profile_default_img_rotated.svg"
                }
                alt={"changeProfileImage"}
                width={73}
                height={73}
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
              className="ml-1 text-center text-sm font-normal text-[#48528E] dark:text-[#e9f5fb]"
              onClick={handleDeleteImage}
            >
              사진지우기
            </button>
          </div>
          <div className="itmes-center mb-8 flex flex-col gap-1">
            <div className="text-lg font-medium text-[#393939] dark:text-[#f1f1f1]">
              닉네임
            </div>
            <div className="relative">
              <input
                className="h-9 w-44 rounded-md border-[1px] border-[#626262] px-2.5 py-2.5 text-base text-[#393939] placeholder:text-sm"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
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
            <span className="ml-1 text-xs font-normal text-[#828282] dark:text-[#f6f6f6]">
              한영문자 2-12글자로 입력해주세요
            </span>
          </div>
        </section>
        <section className="mt-36">
          <button
            onClick={() => setShowModal(true)}
            className="h-[45px] w-[335px] rounded-md bg-[#1F9BDA] text-[17px] font-medium text-white hover:bg-[#1c8cc4] active:bg-[#197cae] dark:bg-[#1774a4] dark:hover:bg-[#135d83] dark:active:bg-[#0e4662]"
          >
            저장
          </button>
        </section>
        {showModal && (
          <ModalWrapper>
            <AlertModal
              title="프로필 변경 완료"
              description="이제 맛집을 찾으러 가볼까요?"
              confirmText="완료"
              onConfirm={() => {
                setShowModal(false);
                router.refresh();
              }}
            />
          </ModalWrapper>
        )}
      </main>
    </>
  );
}
