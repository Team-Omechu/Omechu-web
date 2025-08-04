"use client";

import { useAuthStore } from "@/auth/store";
import ModalWrapper from "@/components/common/ModalWrapper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginPromptModal from "./example_testpage/components/LoginPromptModal";
import { useProfileQuery } from "./hooks/useGetProfile";
import { useTagStore } from "@/lib/stores/tagData.store";
import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

export default function MainPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const {data } = useProfileQuery();
  const { tagDataReset } = useTagStore();
  const { locationReset } = useLocationAnswerStore();
  const { questionReset } = useQuestionAnswerStore();

  const handleStartClick = () => {
    if (data?.error === null) {
      tagDataReset();
      locationReset();
      questionReset();
      router.push("mainpage/question-answer/1");
    } else {
      setShowModal(true);
    }
  };

  const handleRandomClick = () => {
      tagDataReset();
      locationReset();
      questionReset();
      router.push("mainpage/random-recommend");
  }

  return (
    <div className="relative flex h-[calc(100dvh-5rem)] w-full justify-center overflow-hidden scrollbar-hide">
      {/* 메인 배경 이미지 */}
      <Image
        src="/mainpage/mainpage.svg"
        alt="메인 페이지"
        width={375}
        height={800}
        className="object-cover"
      />
      {/* 버튼들 */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform gap-4">
        <button
          className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] bg-primary-normal p-[1.25rem] text-white"
          onClick={handleStartClick}
        >
          <span className="pt-1">시작하기</span>
        </button>
        <button
          className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] border border-[#00A3FF] bg-[#FFF] p-[1.25rem] text-[#00A3FF] hover:bg-secondary-lightHover hover:text-white active:bg-secondary-lightActive active:text-white"
          onClick={handleRandomClick}
        >
          <span className="pt-1">랜덤추천</span>
        </button>
      </div>
      {showModal && (
        <ModalWrapper>
          <LoginPromptModal
            onSkip={() => {
              setShowModal(false);
              router.push("mainpage/question-answer/1");
            }}
            onConfirm={() => router.push("/sign-in")}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
