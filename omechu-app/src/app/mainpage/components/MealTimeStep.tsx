"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/app/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";

const MealTimeStep = () => {
  const router = useRouter();
  const { mealTime, setMealTime } = useQuestionAnswerStore();
  const options = ["아침", "점심", "저녁", "야식"];

  const handleSelect = (option: string) => {
    setMealTime(option);
    router.push("/mainpage/question-answer/2");
  };

  return (
    <QuestionAnswerLayout title="언제 먹는 건가요?">
      {options.map((option) => (
        <ListButton
          key={option}
          onClick={() => handleSelect(option)}
          isSelected={mealTime === option}
          textSize="base"
        >
          {option}
        </ListButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default MealTimeStep;
