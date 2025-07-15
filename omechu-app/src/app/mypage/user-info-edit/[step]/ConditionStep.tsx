"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import ProgressBar from "@/app/components/common/ProgressBar";
import { indexToSlug } from "@/app/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

export default function ConditionStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Zustand에서 상태 가져오기
  const constitution = useOnboardingStore((state) => state.constitution);
  const resetConstitution = useOnboardingStore(
    (state) => state.resetConstitution,
  );

  const resetAll = useOnboardingStore((state) => state.reset); // 전체 초기화 함수

  const toggleConstitution = useOnboardingStore(
    (state) => state.toggleConstitution,
  );

  // 건너뛰기 누르면 상태 초기화하고 다음 페이지로 이동
  const handleSkip = () => {
    resetConstitution();
    router.push(`/mypage/user-info-edit/${indexToSlug[5]}`);
  };

  // 버튼 클릭 시 토글 방식으로 값 추가 또는 제거
  const handleClick = (item: string) => {
    toggleConstitution(item);
  };

  return (
    <div className="flex h-screen w-auto flex-col">
      {/* 상단 진행 바 */}
      <ProgressBar
        currentStep={4}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      {/* 본문 영역 */}
      <main className="relative flex min-h-[calc(100vh-9rem)] w-full flex-col items-center px-4 py-6">
        <section className="my-20">
          <div className="whitespace-pre px-10 text-center text-3xl font-medium leading-relaxed">
            체질은 무엇인가요?
          </div>
        </section>

        {/* 선택 버튼 리스트 */}
        <section className="mt-10 w-full px-5">
          <div className="flex flex-col gap-5">
            {[
              "감기에 잘 걸리는 편이에요",
              "소화가 잘 안되는 날이 많아요",
              "열이 많아서 더위를 잘 타요",
              "추위를 잘 타고 몸이 쉽게 차가워져요",
            ].map((item) => {
              const isSelected = constitution.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`w-full h-12 px-2 pt-1 py-1 text-lg rounded-md border-[1px]
                    ${
                      isSelected
                        ? "bg-[#FB4746] text-white border-[#FB4746]"
                        : "bg-white text-[#FB4746] border-[#FB4746] hover:bg-[#e2403f] hover:text-white"
                    }
                  `}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* 하단 버튼 영역 */}
      <footer className="flex w-full flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between">
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[3]}`)
            }
            className="ml-5 text-base text-[#828282] dark:font-semibold dark:text-white"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={handleSkip}
            className="mr-5 text-base text-[#828282] dark:font-semibold dark:text-white"
          >
            건너뛰기 {">"}
          </button>
        </div>

        {/* 저장 버튼 (선택 안 했으면 비활성화) */}
        <button
          onClick={() =>
            router.push(`/mypage/user-info-edit/${indexToSlug[5]}`)
          }
          disabled={constitution.length === 0}
          className={`h-12 min-w-full rounded-t-md px-2 pt-1 text-xl font-normal text-white ${
            constitution.length === 0
              ? "cursor-not-allowed bg-[#A1A1A1]"
              : "bg-[#1f9bda] hover:bg-[#1c8cc4] active:bg-[#197cae]"
          }`}
        >
          저장
        </button>
      </footer>

      {/* 입력 중단 모달 */}
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
