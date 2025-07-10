"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import ProgressBar from "@/app/components/common/ProgressBar";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import AlertModal from "@/app/components/common/AlertModal";

// Step components
import MealTimeStep from "@/app/components/question-answer/MealTimeStep";
import PurposeStep from "@/app/components/question-answer/PurposeStep";
import MoodStep from "@/app/components/question-answer/MoodStep";
import WhoStep from "@/app/components/question-answer/WhoStep";
import BudgetStep from "@/app/components/question-answer/BudgetStep";
import FinalChoiceStep from "@/app/components/question-answer/FinalChoiceStep";

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
    <div className="relative flex flex-col w-auto h-screen">
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

      <main className="flex flex-col items-center w-full px-4 py-6 min-h-[calc(100vh-9rem)]">
        {renderStepComponent()}
      </main>

      {/* 마지막 스텝에서는 footer를 보여주지 않음 */}
      {step < QUESTION_STEPS && (
        <footer className="flex flex-col w-full pb-[env(safe-area-inset-bottom)] gap-3">
          <div className="flex justify-between">
            {step > 1 ? (
              <button
                onClick={handlePrev}
                className="ml-5 text-base text-[#828282]"
              >
                {"<"} 이전으로
              </button>
            ) : (
              <div />
            )}
            {step > 1 && step < QUESTION_STEPS && (
              <button
                onClick={handleSkip}
                className="mr-5 text-base text-[#828282]"
              >
                건너뛰기 {">"}
              </button>
            )}
          </div>
        </footer>
      )}

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
            confirmText="확인"
          />
        </ModalWrapper>
      )}
    </div>
  );
}
