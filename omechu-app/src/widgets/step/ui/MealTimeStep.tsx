"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { QuestionAnswerLayout } from "./QuestionAnswerLayout";
import {
  mealTimeOptions,
  useQuestionAnswerStore,
} from "../../../entities/question";
import { useTagStore } from "../../../entities/tag";

export const MealTimeStep = () => {
  const router = useRouter();
  const { mealTime, setMealTime } = useQuestionAnswerStore();
  const { setMealTimeTag } = useTagStore();

  const handleSelect = (value: number, label: string, description: string) => {
    setMealTime(value);
    setMealTimeTag(label, description);
    router.push("/mainpage/question-answer/2");
  };

  return (
    <QuestionAnswerLayout title="언제 먹는 건가요?">
      {mealTimeOptions.map(({ label, value, description }) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value, label, description)}
          isSelected={mealTime === value}
          textSize="base"
        >
          {label}
        </ListButton>
      ))}
    </QuestionAnswerLayout>
  );
};
