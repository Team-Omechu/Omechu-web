"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import ProgressBar from "@/app/components/common/ProgressBar";
import { indexToSlug } from "@/app/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

export default function GenderStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Zustand에서 상태와 초기화 함수들 가져옴
  const gender = useOnboardingStore((state) => state.gender);
  const setGender = useOnboardingStore((state) => state.setGender);
  const resetGender = useOnboardingStore((state) => state.resetGender);
  const resetAll = useOnboardingStore((state) => state.reset); //전체 초기화 함수

  // 성별 버튼 클릭하면 토글 형식으로 선택/취소
  const handleGenderClick = (selectedGender: "남성" | "여성") => {
    if (gender === selectedGender) {
      setGender(null); // 이미 선택되어 있으면 취소
    } else {
      setGender(selectedGender); // 아니면 선택
    }
  };

  // 건너뛰기 누르면 값 초기화하고 다음 페이지로
  const handleSkip = () => {
    resetGender(); // 초기화 함수
    router.push(`/mypage/user-info-edit/${indexToSlug[2]}`);
  };

  // 저장 누르면 그대로 다음 단계로 넘어감
  const handleSave = () => {
    if (!gender) return; // 선택 없으면 저장 안 함
    router.push(`/mypage/user-info-edit/${indexToSlug[2]}`);
  };

  return (
    <div className="flex h-screen w-auto flex-col">
      <ProgressBar
        currentStep={1}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      <main className="flex min-h-[calc(100vh-9rem)] w-full flex-col items-center px-4 py-6">
        <section className="my-20">
          <h1 className="text-3xl font-medium">성별은 무엇인가요?</h1>
        </section>

        {/* 성별 선택 버튼 2개 */}
        <section className="my-10">
          <div className="flex gap-5">
            {["여성", "남성"].map((label) => (
              <button
                key={label}
                onClick={() => handleGenderClick(label as "남성" | "여성")}
                className={`h-14 w-28 rounded-md border-[1px] px-2.5 pt-1 text-xl ${
                  gender === label
                    ? "border-[#FB4746] bg-[#FB4746] text-white"
                    : "border-[#FB4746] bg-white text-[#FB4746] hover:bg-[#e2403f] hover:text-white"
                } `}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* 건너뛰기 / 저장 버튼 */}
      <footer className="flex w-full flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={handleSkip}
          className="mr-5 text-base text-[#828282] dark:font-semibold dark:text-white"
        >
          건너뛰기 {">"}
        </button>
        <button
          onClick={handleSave}
          disabled={!gender} // 성별 선택 안 하면 저장 비활성화
          className={`h-12 min-w-full rounded-t-md p-2 text-xl font-normal text-white ${
            gender
              ? "bg-[#1F9BDA] hover:bg-[#1c8cc4] active:bg-[#197cae] dark:bg-[#1774a4] dark:hover:bg-[#135d83] dark:active:bg-[#0e4662]"
              : "cursor-not-allowed bg-[#A1A1A1] dark:bg-[#555]"
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
              router.push(`/mypage/user-info-edit`); // 처음 화면으로 이동
            }}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
