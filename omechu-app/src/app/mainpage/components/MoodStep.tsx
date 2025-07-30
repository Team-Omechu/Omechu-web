"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

import QuestionAnswerLayout from "./QuestionAnswerLayout";
import { useTagStore } from "@/lib/stores/tagData.store";
import { moodOptions } from "@/constant/mainpage/Option";

const MoodStep = () => {
  const router = useRouter();
  const { mood, setMood } = useQuestionAnswerStore();
  const { addTag } = useTagStore();

  const handleSelect = (value: number, label: string, description: string) => {
    setMood(value);
    addTag(label, description);
    router.push("/mainpage/question-answer/4");
  };

  return (
    <QuestionAnswerLayout title="기분 상태는 어떤가요?">
      {moodOptions.map(({ label, value, description }) => (
        <ListButton
          key={value}
          onClick={() => handleSelect(value, label, description)}
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
