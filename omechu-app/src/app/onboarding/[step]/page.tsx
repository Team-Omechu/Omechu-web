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
import { useAuthStore } from "@/lib/stores/auth.store";
import { useCompleteOnboardingMutation } from "@/onboarding/hooks/useOnboarding";
import type { OnboardingRequestData } from "@/onboarding/api/onboarding";
import AllergyStep from "@/onboarding/components/AllergyStep";
import BodyTypeStep from "@/onboarding/components/BodyTypeStep";
import GenderStep from "@/onboarding/components/GenderStep";
import PreferStep from "@/onboarding/components/PreferStep";
import ProfileStep from "@/onboarding/components/ProfileStep";
import ExerciseStep from "@/onboarding/components/ExerciseStep";
import type { LoginSuccessData } from "@/lib/api/auth";

const ONBOARDING_STEPS = 6;

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const onboardingStore = useOnboardingStore();
  const {
    user: authUser,
    login,
    password,
    accessToken,
    refreshToken,
  } = useAuthStore();
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
        return !onboardingStore.exercise;
      case 4:
        return onboardingStore.prefer.length === 0;
      case 5:
        return (
          !onboardingStore.bodyType || onboardingStore.bodyType.length === 0
        );
      default:
        return false;
    }
  }, [step, onboardingStore]);

  const handleNext = () => {
    if (step < ONBOARDING_STEPS) {
      router.push(`/onboarding/${step + 1}`);
    } else {
      // 매퍼 제거: 백엔드가 한국어 값을 받아 내부에서 enum으로 변환
      const BODY_TYPES = ["감기", "소화불량", "더위잘탐", "추위잘탐"] as const;
      const EXERCISES = ["다이어트 중", "증량 중", "유지 중"] as const;

      type BodyType = (typeof BODY_TYPES)[number];
      type Exercise = (typeof EXERCISES)[number];

      const pickedBodyType =
        onboardingStore.bodyType.length > 0
          ? (onboardingStore.bodyType[0] as string)
          : null;
      const bodyTypeForApi: BodyType | null = BODY_TYPES.includes(
        pickedBodyType as BodyType,
      )
        ? (pickedBodyType as BodyType)
        : null;

      const pickedExercise = onboardingStore.exercise as string | null;
      const exerciseForApi: Exercise | null = EXERCISES.includes(
        pickedExercise as Exercise,
      )
        ? (pickedExercise as Exercise)
        : null;

      const dataToSubmit: OnboardingRequestData = {
        nickname: onboardingStore.nickname,
        profileImageUrl: onboardingStore.profileImageUrl || "",
        gender: onboardingStore.gender,
        body_type: bodyTypeForApi,
        exercise: exerciseForApi,
        prefer: onboardingStore.prefer,
        allergy: onboardingStore.allergy,
      };

      completeOnboarding(dataToSubmit, {
        onSuccess: (completedProfile) => {
          if (authUser) {
            const genderForStore = completedProfile.gender ?? "남성";
            const userForLogin: LoginSuccessData = {
              id: completedProfile.id,
              email: completedProfile.email,
              gender: genderForStore,
              nickname: completedProfile.nickname,
              created_at: completedProfile.created_at,
              updated_at: completedProfile.updated_at,
            };

            login({
              accessToken: accessToken ?? "",
              refreshToken: refreshToken ?? "",
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
    // 현재 스텝의 선택 상태를 초기화하고 다음으로 이동
    switch (step) {
      case 2: // 성별
        onboardingStore.resetGender();
        break;
      case 3: // 운동 상태
        onboardingStore.resetExercise();
        break;
      case 4: // 선호 음식 (최대 2개)
        onboardingStore.resetPrefer();
        break;
      case 5: // 체질 (단일 선택)
        onboardingStore.resetBodyType();
        break;
      case 6: // 알레르기 (최대 2개)
        onboardingStore.resetAllergy();
        break;
      default:
        break;
    }
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
    router.push("/mypage");
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
        return <ExerciseStep />;
      case 4:
        return <PreferStep />;
      case 5:
        return <BodyTypeStep />;
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
            title="기본 상태 입력을 중단하시겠어요?"
            description="지금까지 작성한 내용은 저장되지 않아요."
            // 디자인: 왼쪽(테두리) '그만하기', 오른쪽(컬러) '돌아가기'
            confirmText="돌아가기"
            cancelText="그만하기"
            swapButtonOrder
            onConfirm={handleCancelSkip}
            onClose={handleConfirmSkip}
          />
        </ModalWrapper>
      )}
      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </div>
  );
}
