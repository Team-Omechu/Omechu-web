//! 26.01.13 작업

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { STATE_OPTIONS } from "@/shared/constants/mypage";
import {
  BaseModal,
  BottomButton,
  Header,
  ModalWrapper,
  OnboardingButton,
  ProgressBar,
} from "@/shared/index";

export default function StateForm() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showCancleModal, setShowCancleModal] = useState<boolean>(false);

  return (
    <>
      <Header title="기본 상태 입력" onBackClick={() => router.back()} />
      <ProgressBar currentStep={1} totalSteps={3} className="mt-1" />
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
      </section>
      <BottomButton
        disabled={selectedIndex === null}
        onClick={() => router.push("food")}
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
