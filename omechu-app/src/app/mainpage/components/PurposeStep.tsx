"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/app/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";

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
        <ListButton
          key={option}
          onClick={() => handleSelect(option)}
          isSelected={purpose === option}
          textSize="base"
        >
          {option}
        </ListButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default PurposeStep;
