"use client";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { handleLocation } from "../utils/handleLocation";
import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";
const FinalChoiceStep = () => {
  const router = useRouter();
  const { setX, setY } = useLocationAnswerStore();

  const handleClick = () => {
    router.push("/mainpage/result");
    handleLocation(setX, setY);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <ListButton onClick={handleClick} isSelected={false} textSize="base">
        결과 바로 보기
      </ListButton>
      <ListButton
        onClick={() => {
          // TODO: 추가질문 응답 로직
          router.push("/mainpage/meal-answer");
        }}
        isSelected={false}
        textSize="base"
      >
        추가 질문 응답하기
      </ListButton>
    </div>
  );
};

export default FinalChoiceStep;
