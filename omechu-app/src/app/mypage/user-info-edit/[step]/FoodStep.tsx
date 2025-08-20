"use client";

import { useEffect, useMemo, useState } from "react";
import { useProfileQuery } from "../../hooks/useProfileQuery";
const FOOD_LABELS = ["한식", "양식", "중식", "일식", "다른나라 음식"] as const;
const codeFromLabel = (label: (typeof FOOD_LABELS)[number]) =>
  label === "한식"
    ? "KOR"
    : label === "양식"
      ? "WES"
      : label === "중식"
        ? "CHI"
        : label === "일식"
          ? "JPN"
          : "ETC";
const labelFromAny = (v?: string | null) => {
  if (!v) return "";
  const s = String(v);
  if ((FOOD_LABELS as readonly string[]).includes(s)) return s;
  const u = s.toUpperCase();
  if (u === "KOR") return "한식";
  if (u === "WES" || u === "WESTERN") return "양식";
  if (u === "CHI" || u === "CHINESE") return "중식";
  if (u === "JPN" || u === "JAPANESE") return "일식";
  return "다른나라 음식";
};

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

export default function FoodStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Zustand에서 현재 음식 상태랑 toggle 함수 가져옴
  const prefer = useOnboardingStore((state) => state.prefer);
  const resetPrefer = useOnboardingStore((state) => state.resetPrefer);
  const resetAll = useOnboardingStore((state) => state.reset); // 전체 초기화 함수
  const togglePrefer = useOnboardingStore((state) => state.togglePrefer);
  const setPrefer = useOnboardingStore((state) => state.setPrefer);
  const { data: profile } = useProfileQuery();

  useEffect(() => {
    if (
      prefer.length === 0 &&
      Array.isArray(profile?.prefer) &&
      profile!.prefer.length > 0
    ) {
      const mapped = (profile!.prefer as any[])
        .map((x) => labelFromAny(String(x)))
        .filter(Boolean);
      const unique = Array.from(new Set(mapped)).slice(0, 2) as string[];
      if (unique.length > 0) setPrefer(unique);
    }
  }, [prefer.length, profile?.prefer, setPrefer]);

  // 음식 버튼 누르면 선택하거나 해제함 (최대 2개까지만)
  const handleClick = (item: string) => {
    const isSelected = prefer.includes(item);
    if (isSelected || prefer.length < 2) {
      togglePrefer(item);
    }
  };

  // 건너뛰기 누르면 상태 초기화하고 다음 페이지로 이동
  const handleSkip = () => {
    resetPrefer();
    router.push(`/mypage/user-info-edit/${indexToSlug[4]}`);
  };

  // 저장 누르면 다음 페이지로 이동 (선택 없으면 막아둠)
  const handleSave = () => {
    if (prefer.length === 0) return;
    router.push(`/mypage/user-info-edit/${indexToSlug[4]}`);
  };

  return (
    <div className="relative flex min-h-screen w-auto flex-col">
      {/* 상단 진행 바 */}
      <ProgressBar
        currentStep={3}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      {/* 메인 영역 */}
      <main className="flex h-full w-full flex-col items-center px-4 py-6">
        <section className="mb-12 mt-20">
          <div className="whitespace-pre px-10 text-center text-3xl font-medium leading-relaxed">
            평소 자주 먹거나 좋아하는{"\n"}
            음식이 있나요?
          </div>
        </section>

        {/* 음식 선택 버튼 */}
        <section>
          <div className="flex flex-col gap-5">
            {FOOD_LABELS.map((item) => {
              const isSelected = prefer.includes(item);
              const isDisabled = !isSelected && prefer.length >= 2;

              return (
                <button
                  key={`${item}-${prefer.includes(item)}`}
                  onClick={() => {
                    if (!isDisabled) handleClick(item);
                  }}
                  className={`h-12 w-60 rounded-md border-[1px] p-2 pt-2.5 text-xl transition ${
                    isSelected
                      ? "border-primary-normal bg-primary-normal text-white"
                      : "border-primary-normal bg-white text-primary-normal"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* 하단 버튼 영역: 이전 / 건너뛰기 / 저장 */}
      <footer className="absolute bottom-0 flex w-full flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between">
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[2]}`)
            }
            className="ml-5 text-base text-grey-normalActive dark:font-semibold"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={handleSkip}
            className="mr-5 text-base text-grey-normalActive dark:font-semibold"
          >
            건너뛰기 {">"}
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={prefer.length === 0}
          className={`h-14 min-w-full rounded-t-md p-2.5 text-xl font-normal text-white ${
            prefer.length === 0
              ? "cursor-not-allowed bg-[#A1A1A1] dark:bg-[#555]"
              : "bg-secondary-normal hover:bg-secondary-normalHover active:bg-secondary-normalActive"
          }`}
        >
          저장
        </button>
      </footer>

      {/* 중단 확인 모달 */}
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
              router.push(`/mypage/user-info-edit`);
            }}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
