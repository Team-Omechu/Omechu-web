"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";

const MoodStep = () => {
  const router = useRouter();
  const { mood, setMood } = useQuestionAnswerStore();
  const options = [
    { label: "들뜨고 신나요", value: 1 },
    { label: "지치고 피곤해요", value: 2 },
    { label: "슬프고 울적해요", value: 3 },
    { label: "화나고 답답해요", value: 4 },
  ];

  const handleSelect = (value: number) => {
    setMood(value);
    router.push("/mainpage/question-answer/4");
  };

  return (
    <QuestionAnswerLayout title="기분 상태는 어떤가요?">
      {options.map(({ label, value }) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value)}
          isSelected={mood === value}
          textSize="base"
        >
          {label}
        </ListButton>
      ))}
    </QuestionAnswerLayout>
  );
};

export default MoodStep;
