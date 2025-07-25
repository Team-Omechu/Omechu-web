"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";

const MealTimeStep = () => {
  const router = useRouter();
  const { mealTime, setMealTime } = useQuestionAnswerStore();
  const options = [
    { label: "아침", value: 1 },
    { label: "점심", value: 2 },
    { label: "저녁", value: 3 },
    { label: "야식", value: 4 },
  ];

  const handleSelect = (value: number) => {
    setMealTime(value);
    router.push("/mainpage/question-answer/2");
  };

  return (
    <QuestionAnswerLayout title="언제 먹는 건가요?">
      {options.map(({ label, value }) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value)}
          isSelected={mealTime === value}
          textSize="base"
        >
          {label}
        </ListButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default MealTimeStep;
