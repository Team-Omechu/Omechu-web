"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserInfoSetupStore } from "@/lib/stores/userInfoSetup.store";
import ProgressBar from "@/app/components/common/ProgressBar";

// Step components
import GenderStep from "@/app/components/user-info-setup/GenderStep";
import StateStep from "@/app/components/user-info-setup/StateStep";
import FoodStep from "@/app/components/user-info-setup/FoodStep";
import ConditionStep from "@/app/components/user-info-setup/ConditionStep";
import AllergyStep from "@/app/components/user-info-setup/AllergyStep";

const USER_INFO_STEPS = 5;

export default function UserInfoSetupPage() {
  const router = useRouter();
  const params = useParams();
  const store = useUserInfoSetupStore();
  const { setCurrentStep, reset, gender, workoutStatus } = store;

  const step = Number(params.step);

  useEffect(() => {
    if (isNaN(step) || step < 1 || step > USER_INFO_STEPS) {
      router.replace("/mypage/user-info-setup/1");
      return;
    }
    setCurrentStep(step);
  }, [step, router, setCurrentStep]);

  const isNextDisabled = useMemo(() => {
    switch (step) {
      case 1:
        return !gender;
      case 2:
        return !workoutStatus;
      default:
        return false;
    }
  }, [step, gender, workoutStatus]);

  const handleNext = () => {
    if (step < USER_INFO_STEPS) {
      router.push(`/mypage/user-info-setup/${step + 1}`);
    } else {
      // TODO: 저장 로직 (e.g., 서버에 데이터 전송)
      alert("저장되었습니다!");
      reset();
      router.push("/mypage/user-info-edit"); // 또는 마이페이지 등
    }
  };

  const handlePrev = () => router.back();
  const handleSkip = () => handleNext();

  const renderStepComponent = () => {
    switch (step) {
      case 1:
        return <GenderStep />;
      case 2:
        return <StateStep />;
      case 3:
        return <FoodStep />;
      case 4:
        return <ConditionStep />;
      case 5:
        return <AllergyStep />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col w-auto h-screen">
      <header>
        <ProgressBar
          currentStep={step}
          totalSteps={USER_INFO_STEPS}
          cancelButtonText="그만하기"
          cancelButtonAlign="left"
          cancelButtonClassName="w-auto"
          onCancelClick={() => {
            // TODO: 그만하기 모달 구현
            if (confirm("기본 상태 입력을 중단하시겠어요?")) {
              reset();
              router.push("/mypage/user-info-edit");
            }
          }}
        />
      </header>

      <main className="flex flex-col items-center w-full px-4 py-6 min-h-[calc(100vh-9rem)]">
        {renderStepComponent()}
      </main>

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
          {step > 1 && step < USER_INFO_STEPS && (
            <button
              onClick={handleSkip}
              className="mr-5 text-base text-[#828282]"
            >
              건너뛰기 {">"}
            </button>
          )}
        </div>
        <div>
          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className="p-2 min-w-full h-12 rounded-t-md 
          text-white text-xl font-normal
          bg-[#1F9BDA] 
          hover:bg-[#1c8cc4] 
          active:bg-[#197cae]"
          >
            {step === USER_INFO_STEPS ? "저장" : "다음"}
          </button>
        </div>
      </footer>
    </div>
  );
}
