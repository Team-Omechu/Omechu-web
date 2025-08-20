"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { useProfileQuery } from "../../hooks/useProfileQuery";

const LABELS = ["다이어트 중", "증량 중", "유지 중"] as const;
const toCode = (label: (typeof LABELS)[number]) =>
  label === "다이어트 중" ? "DIET" : label === "증량 중" ? "BULK" : "MAINTAIN";
const toLabel = (code?: string | null) =>
  code === "DIET"
    ? "다이어트 중"
    : code === "BULK"
      ? "증량 중"
      : code === "MAINTAIN"
        ? "유지 중"
        : "";

export default function StateStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Zustand에서 상태와 초기화 함수들 가져옴
  const exercise = useOnboardingStore((s) => s.exercise);
  const setExercise = useOnboardingStore((s) => s.setExercise);
  const resetAll = useOnboardingStore((state) => state.reset); // 전체 초기화

  const { data: profile } = useProfileQuery();

  // 프로필에 운동 상태가 있고 스토어가 비어 있으면 초기 하이드레이트
  useEffect(() => {
    if (!exercise && profile?.exercise) {
      const code =
        profile.exercise === "다이어트 중" ||
        profile.exercise === "증량 중" ||
        profile.exercise === "유지 중"
          ? toCode(profile.exercise as any)
          : (profile.exercise as string);
      setExercise(code);
    }
  }, [exercise, profile?.exercise, setExercise]);

  const activeLabel = useMemo(() => toLabel(exercise), [exercise]);
  const handleStatusClick = (label: (typeof LABELS)[number]) => {
    const next = activeLabel === label ? "" : toCode(label);
    setExercise(next);
  };

  const handleSkip = () => {
    setExercise("");
    router.push(`/mypage/user-info-edit/${indexToSlug[3]}`);
  };

  // 다음 버튼은 선택된 값이 있을 때만 작동
  const handleNext = () => {
    if (!exercise) return;
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
            {LABELS.map((label) => (
              <button
                key={`${label}-${activeLabel === label}`}
                onClick={() => handleStatusClick(label)}
                className={`h-12 w-60 rounded-md border-[1px] px-2 text-xl ${
                  activeLabel === label
                    ? "border-primary-normal bg-primary-normal text-white"
                    : "border-primary-normal bg-white text-primary-normal"
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
          disabled={!exercise}
          className={`h-14 min-w-full rounded-t-md p-2.5 text-xl font-normal text-white ${
            exercise
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
