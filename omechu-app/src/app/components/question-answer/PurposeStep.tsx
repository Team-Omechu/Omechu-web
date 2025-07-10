"use client";

import React from "react";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import QuestionAnswerButton from "./QuestionAnswerButton";
import QuestionAnswerLayout from "./QuestionAnswerLayout";
import { useRouter } from "next/navigation";

const PurposeStep = () => {
  const router = useRouter();
  const { purpose, setPurpose } = useQuestionAnswerStore();
  const options = ["든든한 한 끼 식사", "술 겸 안주", "간식", "기념일 식사"];

  const handleSelect = (option: string) => {
    setPurpose(option);
    router.push("/mainpage/question-answer/3");
  };

  return (
    <QuestionAnswerLayout title="식사 목적은 무엇인가요?">
      {options.map((option) => (
        <QuestionAnswerButton
          key={option}
          onClick={() => handleSelect(option)}
          isSelected={purpose === option}
        >
          {option}
        </QuestionAnswerButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default PurposeStep;
