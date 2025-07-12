"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// 운동 상태 전역으로 관리할 스토어
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import ProgressBar from "@/app/components/common/ProgressBar";

export default function SetupState() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Zustand에서 선택된 상태값 + setter 가져오기
  const status = useOnboardingStore((state) => state.workoutStatus);
  const setStatus = useOnboardingStore((state) => state.setWorkoutStatus);

  // 버튼 클릭 시: 같은 값이면 취소, 다르면 선택
  const handleStatusClick = (value: string) => {
    if (status === value) {
      setStatus(null); // 다시 클릭하면 선택 해제
    } else {
      setStatus(value); // 새로 선택
    }
  };

  return (
    <div className="relative flex flex-col w-auto h-screen">
      {/* 상단 진행 바 */}
      <ProgressBar
        currentStep={2}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
      />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex flex-col items-center w-full px-4 py-6 min-h-[calc(100vh-9rem)]">
        {/* 질문 텍스트 */}
        <section className="my-20">
          <div className="px-10 text-3xl font-medium leading-relaxed text-center whitespace-pre">
            지금 어떤 운동 상태에{"\n"}
            가까운가요?
          </div>
        </section>

        {/* 선택 버튼 영역 */}
        <section className="flex flex-col items-center justify-center -mt-4">
          <div className="z-10 flex flex-col gap-5">
            {["다이어트 중", "증량 중", "유지 중"].map((label) => (
              <button
                key={label}
                onClick={() => handleStatusClick(label)}
                className={`w-60 h-12 px-2 text-xl rounded-md border-[1px]
                  ${
                    status === label
                      ? "bg-[#FB4746] text-white border-[#FB4746]" // 선택 시 강조
                      : "bg-white text-[#FB4746] border-[#FB4746] hover:bg-[#e2403f] hover:text-white" // 기본 상태
                  }
                `}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* 하단 네비게이션 (이전 / 건너뛰기 / 다음) */}
      <footer className="flex flex-col w-full pb-[env(safe-area-inset-bottom)] gap-3">
        <div className="flex justify-between">
          <button
            onClick={() => {
              router.push("./gender");
            }}
            className="ml-5 text-base text-[#828282] dark:text-white dark:font-semibold"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={() => {
              router.push("./food");
            }}
            className="mr-5 text-base text-[#828282] dark:text-white dark:font-semibold"
          >
            건너뛰기 {">"}
          </button>
        </div>

        {/* 다음 버튼 (상태값 없이도 가능) */}
        <button
          onClick={() => {
            router.push("./food");
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

      {/* 중단 모달 (그만하기 확인) */}
      {showModal && (
        <ModalWrapper>
          <AlertModal
            title="기본 상태 입력을 중단하시겠어요?"
            description="지금까지 작성한 내용은 저장되지 않아요."
            confirmText="그만하기"
            cancelText="돌아가기"
            onConfirm={() => {
              setShowModal(false);
              router.push("./state"); // 홈 또는 이전 경로
            }}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
