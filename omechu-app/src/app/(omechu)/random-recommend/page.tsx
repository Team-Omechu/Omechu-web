"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Header, ModalWrapper } from "@/shared";
import { useQuestionAnswerStore } from "@/entities/question";
import { RandomRecommendModal } from "@/widgets/RandomRecommendModal";
// TODO: MealIngredientGroup, MealStyleGroup, MealTypeGroup가 shared/widgets에 없음 - 추가 필요
import MealIngredientGroup from "@/components/mainpage/MealIngredientButton";
import MealStyleGroup from "@/components/mainpage/MealStyleButton";
import MealTypeGroup from "@/components/mainpage/MealTypeButton";

export default function RandomRecommendPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { addition, addAddition, removeAddition } = useQuestionAnswerStore();

  const handleModal = () => {
    setShowModal(true);
  };

  const toggleSelect = (item: string) => {
    if (addition.includes(item)) {
      removeAddition(item);
    } else addAddition(item);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <Header
        leftChild={
          <button
            onClick={() => {
              router.push("/mainpage");
            }}
          >
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
        className="border-b-0"
      />

      <div className="mt-5 flex flex-col gap-2">
        {/* 1: type */}
        <MealTypeGroup selectedItems={addition} onToggle={toggleSelect} />

        {/* 2: ingredient */}
        <MealIngredientGroup selectedItems={addition} onToggle={toggleSelect} />

        {/* 3: style */}
        <MealStyleGroup selectedItems={addition} onToggle={toggleSelect} />
      </div>
      <button className="relative mt-10" onClick={handleModal}>
        <p className="absolute -top-1 left-1/2 -translate-x-1/2 text-center font-bold text-[#FF624F]">
          Press me!
        </p>
        <Image
          src={"/mainpage/randombutton.svg"}
          alt={"randombutton"}
          width={190}
          height={127}
        />
      </button>
      {showModal && (
        <ModalWrapper>
          <RandomRecommendModal
            confirmText="선택하기"
            retryText="다시 추천"
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
