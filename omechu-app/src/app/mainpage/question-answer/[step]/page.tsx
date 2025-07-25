"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import StepFooter from "@/components/common/StepFooter";
import BudgetStep from "@/mainpage/components/BudgetStep";
import FinalChoiceStep from "@/mainpage/components/FinalChoiceStep";
import MealTimeStep from "@/mainpage/components/MealTimeStep";
import MoodStep from "@/mainpage/components/MoodStep";
import PurposeStep from "@/mainpage/components/PurposeStep";
import WhoStep from "@/mainpage/components/WhoStep";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

const QUESTION_STEPS = 6;

export default function QuestionAnswerPage() {
  const router = useRouter();
  const params = useParams();
  const store = useQuestionAnswerStore();
  const { setCurrentStep, reset } = store;
  const [showModal, setShowModal] = useState(false);

  const step = Number(params.step);

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
        <header>
          <ProgressBar
            currentStep={step}
            totalSteps={5} // 마지막 스텝은 프로그레스에 포함하지 않음
            onCancelClick={() => setShowModal(true)}
            cancelButtonText="그만하기"
            cancelButtonAlign="left"
            cancelButtonClassName="w-auto"
          />
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
          <AlertModal
            title="메뉴 추천을 중단하시겠어요?"
            onConfirm={() => {
              reset();
              router.push("/mainpage");
              setShowModal(false);
            }}
            onClose={() => setShowModal(false)}
            confirmText="그만하기"
            cancelText="취소"
          />
        </ModalWrapper>
      )}
    </div>
  );
}
