"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { BaseModal, ModalWrapper, ProgressBar } from "@/shared";
import { useQuestionAnswerStore } from "@/entities/question";
import {
  BudgetStep,
  MealTimeStep,
  MoodStep,
  PurposeStep,
  WhoStep,
} from "@/widgets/step";
// TODO: StepFooter가 shared에 없음 - 추가 필요
import StepFooter from "@/components/common/StepFooter";
// TODO: FinalChoiceStep이 widgets/step에 없음 - 추가 필요
import FinalChoiceStep from "@/mainpage/components/FinalChoiceStep";

const QUESTION_STEPS = 6;

export default function QuestionAnswerPage() {
  const router = useRouter();
  const params = useParams();
  const store = useQuestionAnswerStore();
  const { setCurrentStep, questionReset } = store;
  const [showModal, setShowModal] = useState(false);

  const step = Number(params.step);

  const handleConfirm = () => {
    questionReset();
    router.push("/mainpage");
    setShowModal(false);
  };

  useEffect(() => {
    if (isNaN(step) || step < 1 || step > QUESTION_STEPS) {
      router.replace("/mainpage/question-answer/1");
      return;
    }
    setCurrentStep(step);
  }, [step, router, setCurrentStep]);

  const handlePrev = () => router.back();
  const handleSkip = () => router.push(`/mainpage/question-answer/${step + 1}`);
  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <MealTimeStep />;
      case 2:
        return <PurposeStep />;
      case 3:
        return <MoodStep />;
      case 4:
        return <WhoStep />;
      case 5:
        return <BudgetStep />;
      case 6:
        return <FinalChoiceStep />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex h-screen w-auto flex-col">
      {step < QUESTION_STEPS ? (
        <header className="flex items-center justify-between px-4 py-2">
          {/* TODO: shared ProgressBar는 cancel button을 지원하지 않음 - 별도 버튼 추가 */}
          <button
            onClick={() => setShowModal(true)}
            className="text-grey-normal-active text-sm"
          >
            그만하기
          </button>
          <div className="flex-1">
            <ProgressBar currentStep={step} totalSteps={5} />
          </div>
        </header>
      ) : (
        <div className="h-[60px]" />
      )}

      <main className="flex min-h-[calc(100vh-9rem)] w-full flex-col items-center px-4 py-6">
        {renderStepComponent()}
      </main>

      {/* 마지막 스텝에서는 footer를 보여주지 않음 */}
      <StepFooter
        showPrev={step > 1 && step < QUESTION_STEPS}
        showNext={step >= 1 && step < QUESTION_STEPS}
        onPrev={handlePrev}
        onNext={handleSkip}
      />

      {showModal && (
        <ModalWrapper>
          <BaseModal
            title="메뉴 추천을 중단하시겠어요?"
            rightButtonText="그만하기"
            leftButtonText="취소"
            isCloseButtonShow={false}
            onRightButtonClick={handleConfirm}
            onLeftButtonClick={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
