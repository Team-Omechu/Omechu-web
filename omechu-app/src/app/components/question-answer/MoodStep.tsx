"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerButton from "./QuestionAnswerButton";
import QuestionAnswerLayout from "./QuestionAnswerLayout";

const MoodStep = () => {
  const router = useRouter();
  const { mood, setMood } = useQuestionAnswerStore();
  const options = [
    "들뜨고 신나요",
    "지치고 피곤해요",
    "슬프고 울적해요",
    "화나고 답답해요",
  ];

  const handleSelect = (option: string) => {
    setMood(option);
    router.push("/mainpage/question-answer/4");
  };

  return (
    <QuestionAnswerLayout title="기분 상태는 어떤가요?">
      {options.map((option) => (
        <QuestionAnswerButton
          key={option}
          onClick={() => handleSelect(option)}
          isSelected={mood === option}
        >
          {option}
        </QuestionAnswerButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default MoodStep;
