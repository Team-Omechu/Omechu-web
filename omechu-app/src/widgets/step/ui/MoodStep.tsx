"use client";

import React from "react";

import { useRouter } from "next/navigation";

import ListButton from "@/components/common/button/ListButton";

import { QuestionAnswerLayout } from "./QuestionAnswerLayout";
import { moodOptions, useQuestionAnswerStore } from "@/entities/question";
import { useTagStore } from "@/entities/tag";

export const MoodStep = () => {
  const router = useRouter();
  const { mood, setMood } = useQuestionAnswerStore();
  const { setMoodTag } = useTagStore();

  const handleSelect = (value: number, label: string, description: string) => {
    setMood(value);
    setMoodTag(label, description);
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
