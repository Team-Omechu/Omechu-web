"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useTagStore } from "@/entities/tag";
import { handleLocation, useLocationAnswerStore } from "@/entities/location";
import { useQuestionAnswerStore } from "@/entities/question";
import { StartButton } from "@/widgets/mainpage/ui/StartButton";

export default function MainPage() {
  const router = useRouter();
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

  const handleMenuBattleClick = () => {
    router.push("menu-battle");
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
      </div>
      <div className="absolute top-[60%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-5">
        <StartButton
          title="맞춤 추천"
          subTitle="바로 지금, 나만을 위한 메뉴는?"
          onClick={handleStartClick}
        />
        <StartButton
          title="메뉴 배틀"
          subTitle="오늘의 메뉴, 배틀로 정하자"
          onClick={handleMenuBattleClick}
        />
        <StartButton
          title="랜덤 추천"
          subTitle="클릭 한 번으로 바로 결정!"
          onClick={handleRandomClick}
        />
      </div>
    </div>
  );
}
