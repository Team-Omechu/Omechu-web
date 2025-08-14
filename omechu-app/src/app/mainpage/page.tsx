"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import ModalWrapper from "@/components/common/ModalWrapper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginPromptModal from "./example_testpage/components/LoginPromptModal";
import { useTagStore } from "@/lib/stores/tagData.store";
import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import { useProfileQuery } from "./hooks/useGetProfile";
import { handleLocation } from "./utils/handleLocation";

export default function MainPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const { tagDataReset } = useTagStore();
  const { locationReset, setX, setY } = useLocationAnswerStore();
  const { questionReset } = useQuestionAnswerStore();
  const { data } = useProfileQuery();

  console.log("Profile Data:", data);

  const handleStartClick = () => {
    if (isLoggedIn) {
      tagDataReset();
      locationReset();
      questionReset();
      handleLocation(setX, setY);
      router.push("mainpage/question-answer/1");
    } else {
      setShowModal(true);
    }
  };

  const handleRandomClick = () => {
    tagDataReset();
    locationReset();
    questionReset();
    handleLocation(setX, setY);
    router.push("mainpage/random-recommend");
  };

  const handleSkipClick = () => {
    setShowModal(false);
    tagDataReset();
    locationReset();
    questionReset();
    handleLocation(setX, setY);
    router.push("mainpage/question-answer/1");
  };

  return (
    <div className="relative flex h-[calc(100dvh-5rem)] w-full justify-center overflow-hidden scrollbar-hide">
      {/* 메인 배경 이미지 */}
      <Image
        src="/mainpage/mainpage.svg"
        alt="메인 페이지"
        fill
        style={{ objectFit: "cover" }}
        className="object-cover"
      />
      {/* 버튼들 */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform gap-4">
        <button
          className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] bg-primary-normal p-[1.25rem] text-center text-white"
          onClick={handleStartClick}
        >
          <span>시작하기</span>
        </button>
        <button
          className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] border border-[#00A3FF] bg-[#FFF] p-[1.25rem] text-center text-[#00A3FF] hover:bg-secondary-lightHover hover:text-white active:bg-secondary-lightActive active:text-white"
          onClick={handleRandomClick}
        >
          <span>랜덤추천</span>
        </button>
      </div>
      {showModal && (
        <ModalWrapper>
          <LoginPromptModal
            onSkip={handleSkipClick}
            onConfirm={() => router.push("/sign-in")}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
