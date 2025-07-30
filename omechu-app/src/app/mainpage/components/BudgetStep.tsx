"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import QuestionAnswerLayout from "./QuestionAnswerLayout";
import { useTagStore } from "@/lib/stores/tagData.store";
import { budgetOptions } from "@/constant/mainpage/Option";

const BudgetStep = () => {
  const router = useRouter();
  const { budget, setBudget } = useQuestionAnswerStore();
  const { addTag } = useTagStore();
  // 각 옵션에 순서대로 value(1,2,3) 할당

  const handleSelect = (value: number, label: string, description: string) => {
    setBudget(value);
    addTag(label, description);
    router.push("/mainpage/question-answer/6");
  };

  return (
    <QuestionAnswerLayout title="예산은 어떻게 되시나요?">
      {budgetOptions.map(({ label, value, description }) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value, label, description)}
          isSelected={budget === value}
          textSize="base"
        >
          {label}
        </ListButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default BudgetStep;
