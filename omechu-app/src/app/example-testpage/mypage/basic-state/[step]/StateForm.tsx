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

const STATE_OPTIONS = [
  { label: "🏃🏻 다이어트 중", value: "diet" },
  { label: "🏋️ 증량 중", value: "bulk" },
  { label: "🧘🏻 유지 중", value: "maintain" },
] as const;

export default function StateForm() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <Header title="기본 상태 입력" onLeftClick={() => router.back()} />
      <ProgressBar currentStep={1} totalSteps={3} />
      <section className="relative flex min-h-[89dvh] flex-col items-center">
        <h1 className="text-foundation-grey-darker mt-16 text-center text-[28px] font-medium whitespace-pre-line">{`지금 어떤 운동 상태에 \n 가까운가요?`}</h1>
        <div className="mt-20 flex flex-col gap-4">
          {STATE_OPTIONS.map(({ label }, idx) => (
            <OnboardingButton
              key={idx}
              selected={selectedIndex === idx}
              onClick={() => setSelectedIndex(idx)}
            >
              {label}
            </OnboardingButton>
          ))}
        </div>
        <BottomButton
          disabled={selectedIndex === null}
          onClick={() => router.push("food")}
        >
          다음
        </BottomButton>
      </section>
    </>
  );
}
