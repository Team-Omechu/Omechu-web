"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/entities/user/model/auth.store";
import { useTagStore } from "@/entities/tag";
import { handleLocation, useLocationAnswerStore } from "@/entities/location";
import { useQuestionAnswerStore } from "@/entities/question";

export default function MainPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { tagDataReset } = useTagStore();
  const { locationReset, setX, setY } = useLocationAnswerStore();
  const { questionReset } = useQuestionAnswerStore();

  const handleStartClick = () => {
    tagDataReset();
    locationReset();
    questionReset();
    handleLocation(setX, setY);
    router.push("mainpage/question-answer/1");
  };

  const handleRandomClick = () => {
    tagDataReset();
    locationReset();
    questionReset();
    handleLocation(setX, setY);
    router.push("/random-recommend");
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
    </div>
  );
}
