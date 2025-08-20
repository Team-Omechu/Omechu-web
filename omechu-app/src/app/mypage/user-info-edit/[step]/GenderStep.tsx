"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { useProfileQuery } from "../../hooks/useProfileQuery";

const LABELS = ["여성", "남성"] as const;
const toCode = (label: (typeof LABELS)[number]) =>
  label === "여성" ? "F" : "M";
const toLabel = (code?: string | null) =>
  code === "F" ? "여성" : code === "M" ? "남성" : "";

export default function GenderStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Zustand에서 상태와 초기화 함수들 가져옴
  const gender = useOnboardingStore((state) => state.gender);
  const setGender = useOnboardingStore((state) => state.setGender);
  const resetAll = useOnboardingStore((state) => state.reset); //전체 초기화 함수

  const { data: profile } = useProfileQuery();

  // 프로필에 성별이 있고 스토어에 값이 없다면 초기 하이드레이트
  useEffect(() => {
    if (!gender && profile?.gender) {
      // 프로필은 'F'/'M' 또는 '여성'/'남성' 어떤 형식이든 올 수 있음
      const code =
        profile.gender === "여성" || profile.gender === "남성"
          ? toCode(profile.gender as any)
          : (profile.gender as string);
      setGender(code as any);
    }
  }, [gender, profile?.gender, setGender]);

  const activeLabel = useMemo(() => toLabel(gender as any), [gender]);
  const handleGenderClick = (label: "남성" | "여성") => {
    const next = activeLabel === label ? "" : toCode(label);
    setGender(next as any);
  };

  // 건너뛰기 누르면 값 초기화하고 다음 페이지로
  const handleSkip = () => {
    setGender(null);
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

      <main className="flex h-full w-full flex-col items-center px-4 py-6">
        <section className="mb-16 mt-28">
          <h1 className="text-3xl font-medium">성별은 무엇인가요?</h1>
        </section>

        {/* 성별 선택 버튼 2개 */}
        <section className="my-10">
          <div className="flex gap-5">
            {["여성", "남성"].map((label) => (
              <button
                key={`${label}-${activeLabel === label}`}
                onClick={() => handleGenderClick(label as "남성" | "여성")}
                className={`h-14 w-28 rounded-md border-[1px] px-2.5 pt-1 text-xl ${
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

      {/* 건너뛰기 / 저장 버튼 */}
      <section className="absolute bottom-0 flex w-full flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={handleSkip}
          className="mr-5 text-base text-grey-normalActive"
        >
          건너뛰기 {">"}
        </button>
        <button
          onClick={handleSave}
          disabled={!gender} // 성별 선택 안 하면 저장 비활성화
          className={`h-14 min-w-full rounded-t-md p-2.5 text-xl font-normal text-white ${
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
