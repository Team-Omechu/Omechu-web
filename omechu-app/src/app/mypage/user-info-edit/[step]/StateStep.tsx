"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

export default function StateStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Zustand에서 상태와 초기화 함수들 가져옴
  const state = useOnboardingStore((state) => state.exercise);
  const setStatus = useOnboardingStore((state) => state.setExercise);
  const resetExercise = useOnboardingStore((state) => state.resetExercise);
  const resetAll = useOnboardingStore((state) => state.reset); // 전체 초기화

  // 선택 버튼 누르면 같은 값이면 해제, 아니면 선택
  const handleStatusClick = (value: string) => {
    if (state === value) {
      setStatus(null);
    } else {
      setStatus(value);
    }
  };

  // handleSkip 수정
  const handleSkip = () => {
    resetExercise(); // ← 상태 초기화
    router.push(`/mypage/user-info-edit/${indexToSlug[3]}`);
  };

  // 다음 버튼은 선택된 값이 있을 때만 작동
  const handleNext = () => {
    if (!state) return;
    router.push(`/mypage/user-info-edit/${indexToSlug[3]}`);
  };

  return (
    <div className="relative flex min-h-screen w-auto flex-col">
      <ProgressBar
        currentStep={2}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      <main className="flex h-full w-full flex-col items-center px-4 py-6">
        <section className="mb-16 mt-28">
          <div className="whitespace-pre px-10 text-center text-3xl font-medium leading-relaxed">
            지금 어떤 운동 상태에{"\n"}가까운가요?
          </div>
        </section>

        <section className="flex flex-col items-center justify-center">
          <div className="z-10 flex flex-col gap-5">
            {["다이어트 중", "증량 중", "유지 중"].map((label) => (
              <button
                key={`${label}-${state === label}`}
                onClick={() => handleStatusClick(label)}
                className={`h-12 w-60 rounded-md border-[1px] px-2 text-xl ${
                  state === label
                    ? "border-primary-normal bg-primary-normal text-white"
                    : "border-primary-normal bg-white text-primary-normal hover:bg-primary-normalHover hover:text-white"
                } `}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="absolute bottom-0 flex w-full flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between">
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[1]}`)
            }
            className="ml-5 text-base text-grey-normalActive"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={handleSkip}
            className="mr-5 text-base text-grey-normalActive"
          >
            건너뛰기 {">"}
          </button>
        </div>

        {/* 다음 버튼: 선택 없으면 비활성화 */}
        <button
          onClick={handleNext}
          disabled={!state}
          className={`h-14 min-w-full rounded-t-md p-2.5 text-xl font-normal text-white ${
            state
              ? "bg-secondary-normal hover:bg-secondary-normalHover active:bg-secondary-normalActive"
              : "cursor-not-allowed bg-[#A1A1A1]"
          }`}
        >
          저장
        </button>
      </footer>

      {/* 중단 모달 */}
      {showModal && (
        <ModalWrapper>
          <AlertModal
            title="기본 상태 입력을 중단하시겠어요?"
            description="지금까지 작성한 내용은 저장되지 않아요."
            confirmText="그만하기"
            cancelText="돌아가기"
            onConfirm={() => {
              resetAll();
              setShowModal(false);
              router.push(`/mypage/user-info-edit`); // 처음 화면으로 이동
            }}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
