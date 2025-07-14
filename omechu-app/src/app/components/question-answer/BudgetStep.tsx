"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerButton from "./QuestionAnswerButton";
import QuestionAnswerLayout from "./QuestionAnswerLayout";

const BudgetStep = () => {
  const router = useRouter();
  const { budget, setBudget } = useQuestionAnswerStore();
  const options = ["1만원 미만", "1만원~3만원", "3만원 초과"];

  const handleSelect = (option: string) => {
    setBudget(option);
    router.push("/mainpage/question-answer/6");
  };

  return (
    <QuestionAnswerLayout title="예산은 어떻게 되시나요?">
      {options.map((option) => (
        <QuestionAnswerButton
          key={option}
          onClick={() => handleSelect(option)}
          isSelected={budget === option}
        >
          {option}
        </QuestionAnswerButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default BudgetStep;
