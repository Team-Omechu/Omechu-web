"use client";

import React from "react";
import { useRouter } from "next/navigation";

import StepFooter from "@/components/common/StepFooter";
import MealIngredientGroup from "@/components/mainpage/MealIngredientButton";
import MealStyleGroup from "@/components/mainpage/MealStyleButton";
import MealTypeGroup from "@/components/mainpage/MealTypeButton";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import Header from "@/components/common/Header";

export default function MealAnswerPage() {
  const router = useRouter();
  const exceptions = useQuestionAnswerStore((state) => state.exceptions);
  const addException = useQuestionAnswerStore((state) => state.addException);
  const removeException = useQuestionAnswerStore(
    (state) => state.removeException,
  );

  const toggleSelect = (item: string) => {
    if (exceptions.includes(item)) {
      removeException(item);
    } else if (exceptions.length < 3) {
      addException(item);
    }
  };

  const isDisabled = (item: string) =>
    !exceptions.includes(item) && exceptions.length >= 3;

  return (
    <div className="flex h-screen w-full flex-col">
      <Header className="border-b-0" />
      <main className="mb-2 flex min-h-[calc(100vh-9rem)] w-full flex-col items-center justify-center px-4 py-6">
        <div className="mb-10 flex flex-col items-center justify-center text-center text-[25px] font-semibold">
          <p>제외하고 싶은</p>
          <p>음식은 무엇인가요?</p>
        </div>
        <div className="flex w-[310px] flex-col gap-2">
          <MealTypeGroup
            selectedItems={exceptions}
            onToggle={toggleSelect}
            isDisabled={isDisabled}
          />
          <MealIngredientGroup
            selectedItems={exceptions}
            onToggle={toggleSelect}
            isDisabled={isDisabled}
          />
          <MealStyleGroup
            selectedItems={exceptions}
            onToggle={toggleSelect}
            isDisabled={isDisabled}
          />
        </div>

        <button
          className={`mx-auto mt-8 flex h-12.5 w-35 items-center justify-center gap-2.5 rounded-[0.3125rem] p-2.5 text-[1.125rem] font-normal ${"bg-primary-normal text-white hover:bg-primary-normal-hover active:bg-primary-normal-active"}`}
          onClick={() => router.push("/mainpage/location-answer")}
        >
          {exceptions.length > 0
            ? `${exceptions.length}개 제외하기`
            : "모두 반영하기"}
        </button>
      </main>

      <StepFooter
        showNext={true}
        showPrev={true}
        onNext={() => router.push("/mainpage/location-answer")}
        onPrev={() => router.back()}
      />
    </div>
  );
}
