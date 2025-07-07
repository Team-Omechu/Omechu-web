"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import ProgressBar from "@/app/components/common/ProgressBar";
import Button from "@/app/components/auth/Button";

// Step components
import ProfileStep from "@/app/components/onboarding/ProfileStep";
import GenderStep from "@/app/components/onboarding/GenderStep";
import WorkoutStatusStep from "@/app/components/onboarding/WorkoutStatusStep";
import PreferredFoodStep from "@/app/components/onboarding/PreferredFoodStep";
import ConstitutionStep from "@/app/components/onboarding/ConstitutionStep";
import AllergyStep from "@/app/components/onboarding/AllergyStep";

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
      <div className="flex flex-col items-center justify-center h-screen gap-4">
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
    <div className="flex flex-col min-h-screen bg-[#F8D5FF]">
      <div className="px-4 pt-5">
        <ProgressBar
          currentStep={step}
          totalSteps={ONBOARDING_STEPS}
          cancelButtonText="온보딩 그만하기"
          onCancelClick={() => {
            if (confirm("온보딩을 중단하고 메인으로 이동하시겠습니까?")) {
              reset();
              router.push("/");
            }
          }}
        />
      </div>

      <div className="flex flex-col justify-center flex-grow">
        <main className="px-5">{renderStepComponent()}</main>

        <footer className="px-5 pt-12 pb-8">
          <div className="flex items-center justify-between max-w-xs mx-auto text-sm text-gray-500">
            {step > 1 ? (
              <button onClick={handlePrev}>{"<"} 이전으로</button>
            ) : (
              <div />
            )}
            {step > 1 && step < ONBOARDING_STEPS && (
              <button onClick={handleSkip}>건너뛰기 {">"}</button>
            )}
          </div>
          <div className="max-w-xs mx-auto mt-4">
            <Button
              variant="blue"
              size="large"
              onClick={handleNext}
              disabled={isNextDisabled}
            >
              {step === ONBOARDING_STEPS ? "저장" : "다음"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
