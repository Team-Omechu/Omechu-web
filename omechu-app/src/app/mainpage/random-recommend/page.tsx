"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";
import MealIngredientGroup from "@/components/mainpage/MealIngredientButton";
import MealStyleGroup from "@/components/mainpage/MealStyleButton";
import MealTypeGroup from "@/components/mainpage/MealTypeButton";

import RandomRecommendModal from "../components/RandomRecommendModal";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import { handleLocation } from "../utils/handleLocation";
import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";

export default function RandomRecommendPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const exceptions = useQuestionAnswerStore((state) => state.exceptions);
  const addException = useQuestionAnswerStore((state) => state.addException);
  const removeException = useQuestionAnswerStore(
    (state) => state.removeException,
  );
  const { setX, setY } = useLocationAnswerStore();

  const handleModal = () => {
    setShowModal(true);
    handleLocation(setX, setY);
  };

  const toggleSelect = (item: string) => {
    if (exceptions.includes(item)) {
      removeException(item);
    } else if (exceptions.length < 3) {
      addException(item);
    }
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
        <MealTypeGroup selectedItems={exceptions} onToggle={toggleSelect} />

        {/* 2: ingredient */}
        <MealIngredientGroup
          selectedItems={exceptions}
          onToggle={toggleSelect}
        />

        {/* 3: style */}
        <MealStyleGroup selectedItems={exceptions} onToggle={toggleSelect} />
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
