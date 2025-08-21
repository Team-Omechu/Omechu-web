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
    <div className="relative flex w-full flex-1 flex-col justify-center overflow-hidden bg-gradient-to-b from-pink-200 to-purple-300 scrollbar-hide">
      {/* 데스크톱용 컨테이너 */}
      <div
        className="relative mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl"
        style={{ height: "calc(100svh - 5rem)" }}
      >
        <Image
          src="/mainpage/mainpage.png"
          alt="메인 페이지"
          fill
          priority
          sizes="100vw"
          className="object-cover lg:object-contain"
        />
        {/* 버튼들 */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform gap-4 lg:bottom-8">
          <button
            className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] bg-primary-normal p-[1.25rem] text-center text-white transition-all duration-200 hover:bg-primary-normalHover active:bg-primary-normalHover lg:h-12 lg:w-40"
            onClick={handleStartClick}
          >
            <span>시작하기</span>
          </button>
          <button
            className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] border border-[#00A3FF] bg-[#FFF] p-[1.25rem] text-center text-[#00A3FF] transition-all duration-200 hover:bg-grey-lightActive active:bg-grey-lightActive lg:h-12 lg:w-40"
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
