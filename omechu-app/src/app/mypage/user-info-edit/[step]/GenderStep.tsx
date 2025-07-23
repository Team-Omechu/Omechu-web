"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

export default function GenderStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Zustand에서 상태와 초기화 함수들 가져옴
  const [gender, setGender] = useState<"남성" | "여성" | null>(null);
  const resetGender = useOnboardingStore((state) => state.resetGender);
  const resetAll = useOnboardingStore((state) => state.reset); //전체 초기화 함수

  // 성별 버튼 클릭하면 토글 형식으로 선택/취소
  const handleGenderClick = (selectedGender: "남성" | "여성") => {
    setGender((prev) => (prev === selectedGender ? null : selectedGender));
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
    <div className="relative flex h-screen w-auto flex-col">
      <ProgressBar
        currentStep={1}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      <main className="h-full] flex w-full flex-col items-center px-4 py-6">
        <section className="my-20">
          <h1 className="text-3xl font-medium">성별은 무엇인가요?</h1>
        </section>

        {/* 성별 선택 버튼 2개 */}
        <section className="my-10">
          <div className="flex gap-5">
            {["여성", "남성"].map((label) => (
              <button
                key={`${label}-${gender === label}`}
                onClick={() => handleGenderClick(label as "남성" | "여성")}
                className={`h-14 w-28 rounded-md border-[1px] px-2.5 pt-1 text-xl ${
                  gender === label
                    ? "border-primary-normal bg-primary-normal text-white"
                    : "border-primary-normal text-primary-normal hover:bg-primary-normalHover bg-white hover:text-white"
                } `}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* 건너뛰기 / 저장 버튼 */}
      <section className="absolute bottom-0 flex w-full flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={handleSkip}
          className="text-grey-normalActive mr-5 text-base"
        >
          건너뛰기 {">"}
        </button>
        <button
          onClick={handleSave}
          disabled={!gender} // 성별 선택 안 하면 저장 비활성화
          className={`h-12 min-w-full rounded-t-md p-2 text-xl font-normal text-white ${
            gender
              ? "bg-secondary-normal hover:bg-secondary-normalHover active:bg-secondary-normalActive"
              : "cursor-not-allowed bg-[#A1A1A1]"
          }`}
        >
          저장
        </button>
      </section>

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
              router.push("/mypage/user-info-edit"); // 처음 화면으로 이동
            }}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
