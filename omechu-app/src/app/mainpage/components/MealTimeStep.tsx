"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";
import { useTagStore } from "@/lib/stores/tagData.store";
import { mealTimeOptions } from "@/constant/mainpage/Option";

const MealTimeStep = () => {
  const router = useRouter();
  const { mealTime, setMealTime } = useQuestionAnswerStore();
  const {addTag} = useTagStore();

  const handleSelect = (value: number, label:string, description:string) => {
    setMealTime(value);
    addTag(label,description);
    router.push("/mainpage/question-answer/2");
  };

  return (
    <QuestionAnswerLayout title="언제 먹는 건가요?">
      {mealTimeOptions.map(({ label, value, description }) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value,label,description)}
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
