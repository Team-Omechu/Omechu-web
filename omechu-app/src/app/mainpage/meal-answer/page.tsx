"use client";

import StepFooter from "@/app/components/common/StepFooter";
import MealIngredientGroup from "@/app/components/mainpage/MealIngredientButton";
import MealStyleGroup from "@/app/components/mainpage/MealStyleButton";
import MealTypeGroup from "@/app/components/mainpage/MealTypeButton";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function MealAnswerPage() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelect = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((v) => v !== item)
        : prev.length < 3
        ? [...prev, item]
        : prev
    );
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-x-hidden">
      <main className="flex flex-col items-center justify-center flex-1 w-full">
        {/* 질문 문구 */}
        <div className="flex w-[24.5625rem] h-[10rem] flex-col justify-center flex-shrink-0 text-[#393939] text-center font-['Noto Sans KR'] text-[1.5rem] font-medium leading-normal">
          <h2>제외하고 싶은</h2>
          <h2>음식은 무엇인가요?</h2>
        </div>

        <div className="w-[310px] flex flex-col gap-4">
          {/* 1: type */}
          <MealTypeGroup
          selectedItems={selectedItems}
          onToggle={toggleSelect}/>

          {/* 2: ingredient */}
          <MealIngredientGroup
          selectedItems={selectedItems}
          onToggle={toggleSelect}/>

          {/* 3: style */}
          <MealStyleGroup
          selectedItems={selectedItems}
          onToggle={toggleSelect}/>
        </div>

        {/* 하단 반영 버튼 */}
        <button
          className={`mt-8 flex w-[8.75rem] h-[3.125rem] p-[0.625rem] justify-center items-center gap-[0.625rem] flex-shrink-0 rounded-[0.3125rem] border border-[#333] text-center font-['Noto_Sans_KR'] text-[1.125rem] font-normal ${
            selectedItems.length > 0
              ? "bg-[#FB4746] text-white"
              : "bg-white text-black border border-black"
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
      onNext={()=>router.push("./location-answer")}
      onPrev={()=>router.back()}
      />
    </div>
  );
}
