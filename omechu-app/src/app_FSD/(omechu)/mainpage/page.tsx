"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import ModalWrapper from "@/components/common/ModalWrapper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTagStore } from "@/entities_FSD/tag";
import {
  handleLocation,
  useLocationAnswerStore,
} from "@/entities_FSD/location";
import { useQuestionAnswerStore } from "@/entities_FSD/question";
import { LoginPromptModal } from "@/widgets_FSD/LoginModal";

export default function MainPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const { tagDataReset } = useTagStore();
  const { locationReset, setX, setY } = useLocationAnswerStore();
  const { questionReset } = useQuestionAnswerStore();

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
    <div className="scrollbar-hide relative flex h-[calc(100dvh-5rem)] w-full justify-center overflow-hidden bg-linear-to-b from-pink-200 to-purple-300">
      {/* 데스크톱용 컨테이너 */}
      <div className="relative mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl">
        {/* 메인 배경 이미지 */}
        <Image
          src="/mainpage/mainpage.svg"
          alt="메인 페이지"
          fill
          style={{ objectFit: "cover" }}
          className="object-cover lg:object-contain"
        />
        {/* 버튼들 */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform gap-4 lg:bottom-8">
          <button
            className="bg-primary-normal hover:bg-primary-normal-hover active:bg-primary-normal-hover flex h-11.25 w-36.25 shrink-0 items-center justify-center gap-2.5 rounded-md p-5 text-center text-white transition-all duration-200 lg:h-12 lg:w-40"
            onClick={handleStartClick}
          >
            <span>시작하기</span>
          </button>
          <button
            className="hover:bg-grey-light-active active:bg-grey-light-active flex h-11.25 w-36.25 shrink-0 items-center justify-center gap-2.5 rounded-md border border-[#00A3FF] bg-[#FFF] p-5 text-center text-[#00A3FF] transition-all duration-200 lg:h-12 lg:w-40"
            onClick={handleRandomClick}
          >
            <span>랜덤추천</span>
          </button>
        </div>
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
