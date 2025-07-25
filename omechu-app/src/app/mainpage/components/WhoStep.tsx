"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";

const WhoStep = () => {
  const router = useRouter();
  const { who, setWho } = useQuestionAnswerStore();
  const options = [
    { label: "혼자", value: 1 },
    { label: "연인", value: 2 },
    { label: "친구들", value: 3 },
    { label: "가족들", value: 4 },
  ];

  const handleSelect = (value: number) => {
    setWho(value);
    router.push("/mainpage/question-answer/5");
  };

  return (
    <QuestionAnswerLayout title={"혼자 식사하시나요\n누구와 함께 하시나요?"}>
      {options.map(({ label, value }) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value)}
          isSelected={who === value}
          textSize="base"
        >
          {label}
        </ListButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default WhoStep;
