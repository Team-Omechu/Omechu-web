"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";
import { useTagStore } from "@/lib/stores/tagData.store";
import { whoOptions } from "@/constant/mainpage/Option";

const WhoStep = () => {
  const router = useRouter();
  const { who, setWho } = useQuestionAnswerStore();
  const { addTag } = useTagStore();

  const handleSelect = (value: number, label: string, description: string) => {
    setWho(value);
    addTag(label, description);
    router.push("/mainpage/question-answer/5");
  };

  return (
    <QuestionAnswerLayout title={"혼자 식사하시나요\n누구와 함께 하시나요?"}>
      {whoOptions.map(({ label, value, description }) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value, label, description)}
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
