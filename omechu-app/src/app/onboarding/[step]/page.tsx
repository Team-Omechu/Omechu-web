"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import BottomButton from "@/components/common/button/BottomButton";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import AllergyStep from "@/onboarding/components/AllergyStep";
import ConstitutionStep from "@/onboarding/components/ConstitutionStep";
import GenderStep from "@/onboarding/components/GenderStep";
import PreferredFoodStep from "@/onboarding/components/PreferredFoodStep";
import ProfileStep from "@/onboarding/components/ProfileStep";
import WorkoutStatusStep from "@/onboarding/components/WorkoutStatusStep";

const ONBOARDING_STEPS = 6;

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const store = useOnboardingStore();
  const { setCurrentStep, reset } = store;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);

  const step = Number(params.step);

  useEffect(() => {
    if (isNaN(step) || step < 1 || step > ONBOARDING_STEPS) {
      router.replace("/onboarding/1");
      return;
    }
    setCurrentStep(step);
  }, [step, router, setCurrentStep]);

  const isNextDisabled = useMemo(() => {
    switch (step) {
      case 1:
        return store.nickname.length < 2 || store.nickname.length > 12;
      case 2:
        return !store.gender;
      case 3:
        return !store.workoutStatus;
      case 4:
        return store.preferredFood.length === 0;
      case 5:
        return store.constitution.length === 0;
      default:
        return false;
    }
  }, [step, store]);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS) {
      router.push(`/onboarding/${step + 1}`);
    } else {
      // TODO: 온보딩 완료 처리 로직 (e.g., 서버에 데이터 전송)
      setIsModalOpen(true);
    }
  };

  const handlePrev = () => router.back();
  const handleSkip = () => handleNext();

  const handleRecommend = () => {
    // TODO: 온보딩 완료 데이터 서버 전송
    reset();
    router.push("/");
  };

  const handleRecheck = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSkip = () => {
    reset();
    router.push("/");
  };

  const handleCancelSkip = () => {
    setIsSkipModalOpen(false);
  };

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <ProfileStep />;
      case 2:
        return <GenderStep />;
      case 3:
        return <WorkoutStatusStep />;
      case 4:
        return <PreferredFoodStep />;
      case 5:
        return <ConstitutionStep />;
      case 6:
        return <AllergyStep />;
      default:
        // useEffect에서 처리하지만, 만약을 위한 방어 코드
        return null;
    }
  };

  if (isNaN(step) || step < 1 || step > ONBOARDING_STEPS) {
    return null;
  }

  return (
    <div className="relative flex h-screen w-auto flex-col">
      <header>
        <ProgressBar
          currentStep={step}
          totalSteps={ONBOARDING_STEPS}
          cancelButtonText="일단 시작하기"
          cancelButtonAlign="right"
          cancelButtonClassName="w-auto"
          onCancelClick={() => setIsSkipModalOpen(true)}
        />
      </header>

      <main className="flex w-full flex-1 flex-col items-center px-4 py-6">
        {renderStepComponent()}
      </main>

      <footer className="w-full pb-[env(safe-area-inset-bottom)]">
        <div className="mb-3 flex justify-between px-5">
          {step > 1 ? (
            <button onClick={handlePrev} className="text-base text-[#828282]">
              {"<"} 이전으로
            </button>
          ) : (
            <div />
          )}
          {step > 1 && step < ONBOARDING_STEPS && (
            <button onClick={handleSkip} className="text-base text-[#828282]">
              건너뛰기 {">"}
            </button>
          )}
        </div>
        <BottomButton onClick={handleNext} disabled={isNextDisabled}>
          {step === ONBOARDING_STEPS ? "저장" : "다음"}
        </BottomButton>
      </footer>

      {isModalOpen && (
        <ModalWrapper>
          <AlertModal
            title="저장 완료!"
            description="이제 맛있는 메뉴 추천을 받아볼까요?"
            confirmText="추천받기"
            cancelText="내 정보 다시 보기"
            onConfirm={handleRecommend}
            onClose={handleRecheck}
          />
        </ModalWrapper>
      )}

      {isSkipModalOpen && (
        <ModalWrapper>
          <AlertModal
            title="지금까지 작성한 내용은 저장되지 않아요"
            description="그래도 추천받기를 원하시나요?"
            confirmText="그만하기"
            cancelText="돌아가기"
            onConfirm={handleConfirmSkip}
            onClose={handleCancelSkip}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
