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
import { useAuthStore } from "@/auth/store";
import { useCompleteOnboardingMutation } from "@/onboarding/hooks/useOnboarding";
import type { OnboardingRequestData } from "@/onboarding/api/onboarding";
import AllergyStep from "@/onboarding/components/AllergyStep";
import ConstitutionStep from "@/onboarding/components/ConstitutionStep";
import GenderStep from "@/onboarding/components/GenderStep";
import PreferredFoodStep from "@/onboarding/components/PreferredFoodStep";
import ProfileStep from "@/onboarding/components/ProfileStep";
import WorkoutStatusStep from "@/onboarding/components/WorkoutStatusStep";
import { LoginSuccessData } from "@/lib/api/auth";
import {
  GENDER_MAP,
  EXERCISE_MAP,
  PREFER_MAP,
  ALLERGY_MAP,
  CONSTITUTION_MAP,
} from "@/onboarding/utils/enum-mapper";

const ONBOARDING_STEPS = 6;

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const onboardingStore = useOnboardingStore();
  const { user: authUser, login, password, accessToken } = useAuthStore();
  const {
    setCurrentStep,
    reset: resetOnboarding,
    nickname, // reset 후 닉네임을 복원하기 위해 추가
  } = onboardingStore;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { mutate: completeOnboarding, isPending: isCompleting } =
    useCompleteOnboardingMutation();

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
    // 온보딩 첫 단계 진입 시, 이전 데이터 리셋
    if (step === 1) {
      const currentNickname = nickname; // 현재 닉네임 임시 저장
      resetOnboarding();
      onboardingStore.setNickname(currentNickname); // 닉네임만 복원
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
        return (
          !onboardingStore.constitution ||
          onboardingStore.constitution.length === 0
        );
      default:
        return false;
    }
  }, [step, onboardingStore]);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS) {
      router.push(`/onboarding/${step + 1}`);
    } else {
      const genderForApi = onboardingStore.gender
        ? GENDER_MAP[onboardingStore.gender]
        : null;
      const stateForApi = onboardingStore.workoutStatus
        ? EXERCISE_MAP[onboardingStore.workoutStatus]
        : null;
      const preferForApi = onboardingStore.preferredFood.map(
        (p) => PREFER_MAP[p],
      );
      const allergyForApi = onboardingStore.allergies.map(
        (a) => ALLERGY_MAP[a],
      );
      const constitutionForApi =
        onboardingStore.constitution.length > 0
          ? CONSTITUTION_MAP[onboardingStore.constitution[0]]
          : null;

      const dataToSubmit: OnboardingRequestData = {
        password: password,
        nickname: onboardingStore.nickname,
        profileImageUrl: onboardingStore.profileImageUrl || "",
        gender: genderForApi as "male" | "female" | null,
        body_type: constitutionForApi,
        state: stateForApi as "dieting" | "bulking" | "maintaining" | null,
        prefer: preferForApi,
        allergy: allergyForApi,
      };

      completeOnboarding(dataToSubmit, {
        onSuccess: (completedProfile) => {
          if (authUser) {
            const normalizeGender = (g: string): "남성" | "여성" => {
              if (g === "male" || g === "남자" || g === "남성") return "남성";
              if (g === "female" || g === "여자" || g === "여성") return "여성";
              return "남성";
            };

            const userForLogin: LoginSuccessData = {
              id: completedProfile.id,
              email: completedProfile.email,
              gender: normalizeGender(completedProfile.gender),
              nickname: completedProfile.nickname,
              created_at: completedProfile.created_at,
              updated_at: completedProfile.updated_at,
              accessToken: accessToken ?? "",
            };

            login({
              accessToken: accessToken ?? "",
              user: userForLogin,
              password: password,
            });
          }
          setIsModalOpen(true);
        },
        onError: (error) => {
          triggerToast(`정보 저장에 실패했습니다:\n${error.message}`);
        },
      });
    }
  };

  const handlePrev = () => router.back();
  const handleSkip = () => {
    if (step < ONBOARDING_STEPS) {
      router.push(`/onboarding/${step + 1}`);
    }
  };

  const handleRecommend = () => {
    resetOnboarding();
    router.push("/");
  };

  const handleRecheck = () => {
    setIsModalOpen(false);
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
      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </div>
  );
}
