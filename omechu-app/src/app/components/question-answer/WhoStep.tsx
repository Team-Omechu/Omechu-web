"use client";

import React from "react";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import QuestionAnswerButton from "./QuestionAnswerButton";
import QuestionAnswerLayout from "./QuestionAnswerLayout";
import { useRouter } from "next/navigation";

const WhoStep = () => {
  const router = useRouter();
  const { who, setWho } = useQuestionAnswerStore();
  const options = ["혼자", "연인", "친구들", "가족들"];

  const handleSelect = (option: string) => {
    setWho(option);
    router.push("/mainpage/question-answer/5");
  };

  return (
    <QuestionAnswerLayout title={"혼자 식사하시나요\n누구와 함께 하시나요?"}>
      {options.map((option) => (
        <QuestionAnswerButton
          key={option}
          onClick={() => handleSelect(option)}
          isSelected={who === option}
        >
          {option}
        </QuestionAnswerButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default WhoStep;
