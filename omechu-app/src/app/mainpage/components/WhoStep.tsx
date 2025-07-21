"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";

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
        <ListButton
          key={option}
          onClick={() => handleSelect(option)}
          isSelected={who === option}
          textSize="base"
        >
          {option}
        </ListButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default WhoStep;
