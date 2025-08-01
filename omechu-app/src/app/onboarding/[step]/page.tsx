"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import BottomButton from "@/components/common/button/BottomButton";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import StepFooter from "@/components/common/StepFooter";
import Toast from "@/components/common/Toast";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { useOnboarding } from "@/onboarding/hooks/useOnboarding"; // 커스텀 훅 import
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
  const onboardingStore = useOnboardingStore();
  const {
    setCurrentStep,
    nickname,
    reset: resetOnboardingStore,
  } = onboardingStore;

  // 복잡한 로직을 모두 커스텀 훅으로 위임
  const { submitOnboardingData, isCompleting, resetOnboarding } =
    useOnboarding();

  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const step = Number(params.step);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  useEffect(() => {
    if (isNaN(step) || step < 1 || step > ONBOARDING_STEPS) {
      router.replace("/onboarding/1");
      return;
    }
    if (step === 1) {
      const currentNickname = nickname;
      resetOnboardingStore();
      onboardingStore.setNickname(currentNickname);
    }
    setCurrentStep(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, router, setCurrentStep]);

  const isNextDisabled = useMemo(() => {
    switch (step) {
      case 1:
        return (
          onboardingStore.nickname.length < 2 ||
          onboardingStore.nickname.length > 12
        );
      case 2:
        return !onboardingStore.gender;
      case 3:
        return !onboardingStore.workoutStatus;
      case 4:
        return onboardingStore.preferredFood.length === 0;
      case 5:
        return onboardingStore.constitution.length === 0;
      default:
        return false;
    }
  }, [step, onboardingStore]);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS) {
      router.push(`/onboarding/${step + 1}`);
    } else {
      // 데이터 제출 로직 호출
      submitOnboardingData();
    }
  };

  const handlePrev = () => router.back();
  const handleSkip = () => {
    if (step < ONBOARDING_STEPS) {
      router.push(`/onboarding/${step + 1}`);
    }
  };

  const handleConfirmSkip = () => {
    resetOnboarding();
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

      <StepFooter
        showPrev={step > 1}
        onPrev={handlePrev}
        showNext={step > 1 && step < ONBOARDING_STEPS}
        onNext={handleSkip}
      >
        <BottomButton
          onClick={handleNext}
          disabled={isNextDisabled || isCompleting}
        >
          {isCompleting
            ? "저장하는 중..."
            : step === ONBOARDING_STEPS
              ? "저장"
              : "다음"}
        </BottomButton>
      </StepFooter>

      {/* 성공 모달은 이제 /onboarding/complete 페이지에서 처리합니다. */}

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
      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </div>
  );
}
