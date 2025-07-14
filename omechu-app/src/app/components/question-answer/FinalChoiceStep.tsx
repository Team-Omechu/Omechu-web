"use client";

import { useRouter } from "next/navigation";
import QuestionAnswerButton from "./QuestionAnswerButton";

const FinalChoiceStep = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5">
      <QuestionAnswerButton
        onClick={() => {
          // TODO: 결과보기 로직
          router.push("/mainpage");
        }}
        isSelected={false}
      >
        결과 바로 보기
      </QuestionAnswerButton>
      <QuestionAnswerButton
        onClick={() => {
          // TODO: 추가질문 응답 로직
          router.push("/mainpage/meal-answer");
        }}
        isSelected={false}
      >
        추가 질문 응답하기
      </QuestionAnswerButton>
    </div>
  );
};

export default FinalChoiceStep;
