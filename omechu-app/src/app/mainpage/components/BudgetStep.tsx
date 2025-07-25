"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import QuestionAnswerLayout from "./QuestionAnswerLayout";

const BudgetStep = () => {
  const router = useRouter();
  const { budget, setBudget } = useQuestionAnswerStore();

  // 각 옵션에 순서대로 value(1,2,3) 할당
  const options = [
    { label: "1만원 미만", value: 1 },
    { label: "1만원~3만원", value: 2 },
    { label: "3만원 초과", value: 3 },
  ];

  const handleSelect = (value: number) => {
    setBudget(value);
    router.push("/mainpage/question-answer/6");
  };

  return (
    <QuestionAnswerLayout title="예산은 어떻게 되시나요?">
      {options.map(({ label, value }) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value)}
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
