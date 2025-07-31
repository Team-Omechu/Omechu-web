"use client";

import { useAuthStore } from "@/auth/store";
import ModalWrapper from "@/components/common/ModalWrapper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginPromptModal from "./example_testpage/components/LoginPromptModal";
import { se } from "date-fns/locale";

export default function MainPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  const handleStartClick = () => {
    if (!isLoggedIn) {
      router.push("mainpage/question-answer/1");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="relative flex w-full justify-center overflow-hidden">
      {/* 메인 배경 이미지 */}
      <Image
        src="/mainpage/mainpage.svg"
        alt="메인 페이지"
        width={375}
        height={700}
        className="h-[660px] w-[375px] object-cover"
      />
      {/* 버튼들 */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 transform gap-[0.625rem]">
        <button
          className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] bg-primary-normal p-[1.25rem] text-white"
          onClick={handleStartClick}
        >
          시작하기
        </button>
        <button
          className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] border border-[#00A3FF] bg-[#FFF] p-[1.25rem] text-[#00A3FF]"
          onClick={() => router.push("mainpage/random-recommend")}
        >
          랜덤추천
        </button>
      </div>
      {showModal && (
        <ModalWrapper>
          <LoginPromptModal
            onClose={() => {
              setShowModal(false);
              router.push("mainpage/question-answer/1");
            }}
            onConfirm={() => router.push("/sign-in")}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
