//! 26.01.13 작업

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  BottomButton,
  Header,
  OnboardingButton,
  ProgressBar,
} from "@/shared_FSD/index";

const FOOD_OPTIONS = [
  { label: "🍚 한식", value: "korean" },
  { label: "🍝 양식", value: "western" },
  { label: "🥟 중식", value: "chinese" },
  { label: "🍣 일식", value: "japanese" },
  { label: "🌮 다른 나라", value: "other" },
] as const;

export default function FoodForm() {
  const router = useRouter();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  return (
    <>
      <Header title="기본 상태 입력" onLeftClick={() => router.back()} />
      <ProgressBar currentStep={2} totalSteps={3} />
      <section className="relative flex min-h-[89dvh] flex-col items-center">
        <h1 className="text-foundation-grey-darker mt-16 text-center text-[28px] font-medium whitespace-pre-line">{`지금 어떤 운동 상태에 \n 가까운가요?`}</h1>
        <div className="mt-20 flex flex-col gap-4">
          {FOOD_OPTIONS.map(({ label }, idx) => (
            <OnboardingButton
              key={idx}
              selected={selectedIndexes.includes(idx)}
              onClick={() => {
                if (selectedIndexes.includes(idx)) {
                  setSelectedIndexes(selectedIndexes.filter((i) => i !== idx));
                } else if (selectedIndexes.length < 2) {
                  setSelectedIndexes([...selectedIndexes, idx]);
                }
              }}
            >
              {label}
            </OnboardingButton>
          ))}
        </div>
        <BottomButton
          disabled={selectedIndexes.length === 0}
          onClick={() => router.push("allergy")}
        >
          다음
        </BottomButton>
      </section>
    </>
  );
}
