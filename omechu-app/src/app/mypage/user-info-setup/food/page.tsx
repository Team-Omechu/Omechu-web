"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useOnboardingStore } from "@/lib/stores/onboarding.store";

import ProgressBar from "@/app/components/common/ProgressBar";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import AlertModal from "@/app/components/common/AlertModal";

export default function SetupFood() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // 상태 가져오기 (Zustand)
  const preferredFood = useOnboardingStore((state) => state.preferredFood);
  const togglePreferredFood = useOnboardingStore(
    (state) => state.togglePreferredFood
  );

  // 버튼 클릭 시 배열에서 토글
  const handleClick = (item: string) => {
    togglePreferredFood(item);
  };

  return (
    <div className="flex flex-col w-auto h-screen">
      {/* 진행 상태 표시 */}
      <ProgressBar
        currentStep={3}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
      />

      {/* 질문 영역 */}
      <main className="flex flex-col items-center w-full px-4 py-6 min-h-[calc(100vh-9rem)]">
        <section className="my-20">
          <div className="px-10 text-3xl font-medium leading-relaxed text-center whitespace-pre">
            평소 자주 먹거나 좋아하는{"\n"}
            음식이 있나요?
          </div>
        </section>

        {/* 음식 선택 버튼 영역 */}
        <section className="-mt-4">
          <div className="flex flex-col gap-5">
            {["한식", "양식", "중식", "일식", "다른나라 음식"].map((item) => {
              const isSelected = preferredFood.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`w-60 h-12 p-2 text-xl rounded-md border-[1px]
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

      {/* 네비게이션: 이전 / 건너뛰기 / 다음 */}
      <footer className="flex flex-col w-full pb-[env(safe-area-inset-bottom)] gap-3">
        <div className="flex justify-between">
          <button
            onClick={() => {
              router.push("./state");
            }}
            className="ml-5 text-base text-[#828282] dark:text-white dark:font-semibold"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={() => {
              router.push("./condition");
            }}
            className="mr-5 text-base text-[#828282] dark:text-white dark:font-semibold"
          >
            건너뛰기 {">"}
          </button>
        </div>
        <button
          onClick={() => {
            router.push("./condition");
          }}
          className="p-2 min-w-full h-12  rounded-t-md 
                    text-white text-xl font-normal
                    bg-[#1F9BDA] dark:bg-[#1774a4]
                    hover:bg-[#1c8cc4] dark:hover:bg-[#135d83]
                    active:bg-[#197cae] dark:active:bg-[#0e4662]"
        >
          다음
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
              setShowModal(false);
              router.push("./");
            }}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
