"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useOnboardingStore } from "@/lib/stores/onboarding.store";

import ProgressBar from "@/app/components/common/ProgressBar";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import AlertModal from "@/app/components/common/AlertModal";
import { indexToSlug } from "@/app/constant/UserInfoEditSteps";

export default function FoodStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Zustand에서 현재 음식 상태랑 toggle 함수 가져옴
  const preferredFood = useOnboardingStore((state) => state.preferredFood);
  const resetPreferredFood = useOnboardingStore(
    (state) => state.resetPreferredFood
  );
  const resetAll = useOnboardingStore((state) => state.reset); // 전체 초기화 함수

  const togglePreferredFood = useOnboardingStore(
    (state) => state.togglePreferredFood
  );

  // 음식 버튼 누르면 선택하거나 해제함 (최대 2개까지만)
  const handleClick = (item: string) => {
    const isSelected = preferredFood.includes(item);
    if (isSelected || preferredFood.length < 2) {
      togglePreferredFood(item);
    }
  };

  // 건너뛰기 누르면 상태 초기화하고 다음 페이지로 이동
  const handleSkip = () => {
    resetPreferredFood();
    router.push(`/mypage/user-info-edit/${indexToSlug[4]}`);
  };

  // 저장 누르면 다음 페이지로 이동 (선택 없으면 막아둠)
  const handleSave = () => {
    if (preferredFood.length === 0) return;
    router.push(`/mypage/user-info-edit/${indexToSlug[4]}`);
  };

  return (
    <div className="flex flex-col w-auto h-screen">
      {/* 상단 진행 바 */}
      <ProgressBar
        currentStep={3}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      {/* 메인 영역 */}
      <main className="flex flex-col items-center w-full px-4 py-6 min-h-[calc(100vh-9rem)]">
        <section className="my-20">
          <div className="px-10 text-3xl font-medium leading-relaxed text-center whitespace-pre">
            평소 자주 먹거나 좋아하는{"\n"}
            음식이 있나요?
          </div>
        </section>

        {/* 음식 선택 버튼 */}
        <section className="-mt-4">
          <div className="flex flex-col gap-5">
            {["한식", "양식", "중식", "일식", "다른나라 음식"].map((item) => {
              const isSelected = preferredFood.includes(item);
              const isDisabled = !isSelected && preferredFood.length >= 2;

              return (
                <button
                  key={item}
                  onClick={() => {
                    if (!isDisabled) handleClick(item);
                  }}
                  className={`w-60 h-12 p-2 pt-2.5 text-xl rounded-md border-[1px] transition ${
                    isSelected
                      ? "bg-[#FB4746] text-white border-[#FB4746]"
                      : "bg-white text-[#FB4746] border-[#FB4746] hover:bg-[#e2403f] hover:text-white"
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
      <footer className="flex flex-col w-full pb-[env(safe-area-inset-bottom)] gap-3">
        <div className="flex justify-between">
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[2]}`)
            }
            className="ml-5 text-base text-[#828282] dark:text-white dark:font-semibold"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={handleSkip}
            className="mr-5 text-base text-[#828282] dark:text-white dark:font-semibold"
          >
            건너뛰기 {">"}
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={preferredFood.length === 0}
          className={`p-2 min-w-full h-12 rounded-t-md text-white text-xl font-normal ${
            preferredFood.length === 0
              ? "bg-[#A1A1A1] dark:bg-[#555] cursor-not-allowed"
              : "bg-[#1F9BDA] dark:bg-[#1774a4] hover:bg-[#1c8cc4] dark:hover:bg-[#135d83] active:bg-[#197cae] dark:active:bg-[#0e4662]"
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
