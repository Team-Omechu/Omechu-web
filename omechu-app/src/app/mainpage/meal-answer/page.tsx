"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import StepFooter from "@/app/components/common/StepFooter";
import MealIngredientGroup from "@/app/components/mainpage/MealIngredientButton";
import MealStyleGroup from "@/app/components/mainpage/MealStyleButton";
import MealTypeGroup from "@/app/components/mainpage/MealTypeButton";

export default function MealAnswerPage() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelect = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((v) => v !== item)
        : prev.length < 3
          ? [...prev, item]
          : prev,
    );
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-x-hidden">
      <main className="flex w-full flex-1 flex-col items-center justify-center">
        {/* 질문 문구 */}
        <div className="font-['Noto Sans KR'] flex h-[10rem] w-[24.5625rem] flex-shrink-0 flex-col justify-center text-center text-[1.5rem] font-medium leading-normal text-[#393939]">
          <h2>제외하고 싶은</h2>
          <h2>음식은 무엇인가요?</h2>
        </div>

        <div className="flex w-[310px] flex-col gap-4">
          {/* 1: type */}
          <MealTypeGroup
            selectedItems={selectedItems}
            onToggle={toggleSelect}
          />

          {/* 2: ingredient */}
          <MealIngredientGroup
            selectedItems={selectedItems}
            onToggle={toggleSelect}
          />

          {/* 3: style */}
          <MealStyleGroup
            selectedItems={selectedItems}
            onToggle={toggleSelect}
          />
        </div>

        {/* 하단 반영 버튼 */}
        <button
          className={`mt-8 flex h-[3.125rem] w-[8.75rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.3125rem] border border-[#333] p-[0.625rem] text-center font-['Noto_Sans_KR'] text-[1.125rem] font-normal ${
            selectedItems.length > 0
              ? "bg-[#FB4746] text-white"
              : "border border-black bg-white text-black"
          }`}
          onClick={() => router.push("./location-answer")}
        >
          {selectedItems.length > 0
            ? `${selectedItems.length}개 제외하기`
            : "모두 반영하기"}
        </button>
      </main>

      {/* 하단 네비게이션 */}
      <StepFooter
        showNext={true}
        showPrev={true}
        onNext={() => router.push("./location-answer")}
        onPrev={() => router.back()}
      />
    </div>
  );
}
