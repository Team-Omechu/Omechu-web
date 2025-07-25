"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import QuestionAnswerLayout from "@/mainpage/components/QuestionAnswerLayout";
import StepFooter from "@/components/common/StepFooter";
import MealIngredientGroup from "@/components/mainpage/MealIngredientButton";
import MealStyleGroup from "@/components/mainpage/MealStyleButton";
import MealTypeGroup from "@/components/mainpage/MealTypeButton";

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
    <div className="flex h-screen w-full flex-col">
      {/* Layout 적용 */}
      <main className="flex min-h-[calc(100vh-9rem)] w-full flex-col items-center justify-center px-4 py-6">
        <QuestionAnswerLayout
          title={"제외하고 싶은\n음식은 무엇인가요?"}
          paddingClassName=""
          contentClassName="flex flex-col items-center justify-start space-y-0"
        >
          <div className="flex w-[310px] flex-col gap-2">
            <MealTypeGroup
              selectedItems={selectedItems}
              onToggle={toggleSelect}
            />
            <MealIngredientGroup
              selectedItems={selectedItems}
              onToggle={toggleSelect}
            />
            <MealStyleGroup
              selectedItems={selectedItems}
              onToggle={toggleSelect}
            />
          </div>

          <button
            className={`mx-auto mt-8 flex h-[3.125rem] w-[8.75rem] items-center justify-center gap-[0.625rem] rounded-[0.3125rem] p-[0.625rem] text-[1.125rem] font-normal ${
              selectedItems.length > 0
                ? "bg-primary-normal text-white hover:bg-primary-normalHover active:bg-primary-normalActive"
                : "border border-black bg-white text-black hover:bg-primary-normalHover hover:text-white active:bg-primary-normalActive"
            }`}
            onClick={() => router.push("/mainpage/location-answer")}
          >
            {selectedItems.length > 0
              ? `${selectedItems.length}개 제외하기`
              : "모두 반영하기"}
          </button>
        </QuestionAnswerLayout>
      </main>

      {/* 하단 네비게이션 */}
      <StepFooter
        showNext={true}
        showPrev={true}
        onNext={() => router.push("/mainpage/location-answer")}
        onPrev={() => router.back()}
      />
    </div>
  );
}
