"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Header, ModalWrapper } from "@/shared";
import { useQuestionAnswerStore } from "@/entities/question";
import { RandomRecommendModal } from "@/widgets/RandomRecommendModal";

import {
  EMPTY_RANDOM_DRAW_SELECTION,
  type RandomDrawSelection,
  type RandomDrawGroupKey,
} from "@/entities/randomDraw";
import { RandomDrawSelector } from "@/widgets/RandomDraw";

export default function RandomRecommendPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { addition, addAddition, removeAddition } = useQuestionAnswerStore();

  // ✅ RandomDrawSelector가 요구하는 selection 상태
  const [selection, setSelection] = useState<RandomDrawSelection>(
    EMPTY_RANDOM_DRAW_SELECTION,
  );

  const handleModal = () => {
    setShowModal(true);
  };

  // ✅ selection의 "선택된 값들"만 뽑아서 배열화
  const selectedValues = useMemo(() => {
    return Object.values(selection).flat();
  }, [selection]);

  useEffect(() => {
    for (const v of selectedValues) {
      if (!addition.includes(v)) addAddition(v);
    }

    for (const v of addition) {
      if (!selectedValues.includes(v)) removeAddition(v);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValues]);

  // ✅ selector 내부에서 토글된 값이 넘어오면 selection 업데이트
  const handleSelectionChange = (next: RandomDrawSelection) => {
    setSelection(next);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <Header onLeftClick={() => router.back()} />

      <div className="border-font-placeholder/80 mt-5 flex flex-col gap-2 border-b pb-4">
        <RandomDrawSelector
          value={selection}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <button className="relative mt-10" onClick={handleModal} type="button">
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
