"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";

const PurposeStep = () => {
  const router = useRouter();
  const { purpose, setPurpose } = useQuestionAnswerStore();
  const options = [
    {label: "든든한 한 끼 식사", value: 1},
    {label:"술 겸 안주", value:2}, 
    {label:"간식", value:3}, 
    {label:"기념일 식사",value:4},
  ];

  const handleSelect = (value:number) => {
    setPurpose(value);
    router.push("/mainpage/question-answer/3");
  };

  return (
    <QuestionAnswerLayout title="식사 목적은 무엇인가요?">
      {options.map(({label,value}) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value)}
          isSelected={purpose === value}
          textSize="base"
        >
          {label}
        </ListButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default PurposeStep;
