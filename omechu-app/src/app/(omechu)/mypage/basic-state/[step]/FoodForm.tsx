//! 26.01.13 작업

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { FOOD_OPTIONS } from "@/shared/constants/mypage";
import {
  BaseModal,
  BottomButton,
  Header,
  ModalWrapper,
  OnboardingButton,
  ProgressBar,
} from "@/shared/index";

export default function FoodForm() {
  const router = useRouter();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [showCancleModal, setShowCancleModal] = useState<boolean>(false);

  return (
    <>
      <Header title="기본 상태 입력" onBackClick={() => router.back()} />
      <ProgressBar currentStep={2} totalSteps={3} />
      <section className="relative flex min-h-[89dvh] flex-col items-center">
        <h1 className="text-foundation-grey-darker mt-16 text-center text-[28px] font-medium whitespace-pre-line">{`평소 자주 먹거나 좋아하는 \n 음식이 있나요?`}</h1>
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
      </section>
      <BottomButton
        disabled={selectedIndexes.length === 0}
        onClick={() => router.push("allergy")}
      >
        다음
      </BottomButton>
      {showCancleModal && (
        <ModalWrapper>
          <BaseModal
            title="기본 상태 입력을 중단하시겠어요?"
            desc="지금까지 작성한 내용은 저장되지 않아요."
            isCloseButtonShow={false}
            leftButtonText="그만하기"
            rightButtonText="계속하기"
            onLeftButtonClick={() => router.push("/mypage")}
            onRightButtonClick={() => setShowCancleModal(false)}
          />
        </ModalWrapper>
      )}
    </>
  );
}
