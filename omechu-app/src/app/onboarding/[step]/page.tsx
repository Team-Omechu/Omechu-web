"use client";

import { useEffect, useMemo } from "react";

import { useParams, useRouter } from "next/navigation";

import Button from "@/app/components/auth/Button";
import ProgressBar from "@/app/components/common/ProgressBar";
import AllergyStep from "@/app/components/onboarding/AllergyStep";
import ConstitutionStep from "@/app/components/onboarding/ConstitutionStep";
import GenderStep from "@/app/components/onboarding/GenderStep";
import PreferredFoodStep from "@/app/components/onboarding/PreferredFoodStep";
import ProfileStep from "@/app/components/onboarding/ProfileStep";
import WorkoutStatusStep from "@/app/components/onboarding/WorkoutStatusStep";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

const ONBOARDING_STEPS = 6;

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const store = useOnboardingStore();
  const { setCurrentStep, reset } = store;

  const step = Number(params.step);

  useEffect(() => {
    if (isNaN(step) || step < 1) {
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
      default:
        return false;
    }
  }, [step, store]);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS) {
      router.push(`/onboarding/${step + 1}`);
    } else {
      // TODO: 온보딩 완료 처리 로직 (e.g., 서버에 데이터 전송)
      alert("온보딩이 완료되었습니다!");
      reset();
      router.push("/");
    }
  };

  const handlePrev = () => router.back();
  const handleSkip = () => handleNext();

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
        router.replace("/onboarding/1");
        return null;
    }
  };

  if (isNaN(step) || step > ONBOARDING_STEPS) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p>잘못된 접근입니다.</p>
        <Button
          variant="red"
          size="medium"
          onClick={() => router.push("/")}
          className="w-40"
        >
          홈으로
        </Button>
      </div>
    );
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
          onCancelClick={() => {
            if (confirm("일단 시작하기")) {
              reset();
              router.push("/");
            }
          }}
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
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className="h-12 w-full bg-[#1F9BDA] p-2 text-xl font-normal text-white hover:bg-[#1c8cc4] active:bg-[#197cae] disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:active:bg-gray-400"
        >
          {step === ONBOARDING_STEPS ? "저장" : "다음"}
        </button>
      </footer>
    </div>
  );
}
