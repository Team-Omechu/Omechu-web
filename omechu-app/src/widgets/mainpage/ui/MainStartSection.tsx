"use client";

import Image from "next/image";

import { StartButton } from "./StartButton";
import { MainPick } from "../model/types";

type Props = {
  picked: MainPick;
  onPickStart: () => void;
  onPickBattle: () => void;
  onPickRandom: () => void;
};

export function MainStartSection({
  picked,
  onPickStart,
  onPickBattle,
  onPickRandom,
}: Props) {
  return (
    <div className="absolute top-[45%] left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-5">
      {/*오메추 글자 이미지 */}
      <Image
        src="/logo/logo.svg"
        alt="메인 로고"
        width={260}
        height={170}
        className="flex justify-center"
      />

      <section className="mt-10 flex flex-col gap-5">
        {/*맞춤 추천 StartButton*/}
        <StartButton
          title="맞춤 추천"
          subTitle="바로 지금, 나만을 위한 메뉴는?"
          selected={picked === "start"}
          dimmed={picked !== null && picked !== "start"}
          onClick={onPickStart}
        />
        {/*메뉴 배틀 StartButton*/}
        <StartButton
          title="메뉴 배틀"
          subTitle="오늘의 메뉴, 배틀로 정하자"
          selected={picked === "battle"}
          dimmed={picked !== null && picked !== "battle"}
          onClick={onPickBattle}
        />
        {/*랜덤 추천 StartButton*/}
        <StartButton
          title="랜덤 추천"
          subTitle="클릭 한 번으로 바로 결정!"
          selected={picked === "random"}
          dimmed={picked !== null && picked !== "random"}
          onClick={onPickRandom}
        />
      </section>
    </div>
  );
}
