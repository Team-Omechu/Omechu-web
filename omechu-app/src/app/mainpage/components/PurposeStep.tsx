"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";
import { useTagStore } from "@/lib/stores/tagData.store";
import { purposeOptions } from "@/constant/mainpage/Option";

const PurposeStep = () => {
  const router = useRouter();
  const { purpose, setPurpose } = useQuestionAnswerStore();
  const {addTag} = useTagStore();

  const handleSelect = (value: number, label: string, description:string) => {
    setPurpose(value);
    addTag(label,description)
    router.push("/mainpage/question-answer/3");
  };

  return (
    <QuestionAnswerLayout title="식사 목적은 무엇인가요?">
      {purposeOptions.map(({ label, value, description }) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value,label,description)}
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
