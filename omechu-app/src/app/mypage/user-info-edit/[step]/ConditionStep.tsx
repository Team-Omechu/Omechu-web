"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

import { useProfileQuery } from "../../hooks/useProfileQuery";

const LABELS = [
  "감기에 잘 걸리는 편이에요",
  "소화가 잘 안되는 날이 많아요",
  "열이 많아서 더위를 잘 타요",
  "추위를 잘 타고 몸이 쉽게 차가워져요",
] as const;
type Label = (typeof LABELS)[number];

const toLabel = (codeOrLabel?: string | null): Label | "" => {
  if (!codeOrLabel) return "";
  const s = String(codeOrLabel).trim();
  if ((LABELS as readonly string[]).includes(s)) return s as Label;
  const u = s.toUpperCase();
  if (u.includes("COLD") || u.includes("WEAK") || u.includes("CATCH"))
    return "감기에 잘 걸리는 편이에요";
  if (u.includes("DIGEST")) return "소화가 잘 안되는 날이 많아요";
  if (u.includes("HEAT") || u.includes("HOT"))
    return "열이 많아서 더위를 잘 타요";
  if (u.includes("CHILL") || u.includes("COLDNESS"))
    return "추위를 잘 타고 몸이 쉽게 차가워져요";
  return "";
};

export default function ConditionStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  // Zustand에서 상태 가져오기
  const bodyType = useOnboardingStore((state) => state.bodyType);
  const resetBodyType = useOnboardingStore((state) => state.resetBodyType);

  const resetAll = useOnboardingStore((state) => state.reset); // 전체 초기화 함수

  const toggleBodyType = useOnboardingStore((state) => state.toggleBodyType);

  const setBodyType = useOnboardingStore((state) => state.setBodyType);
  const { data: profile } = useProfileQuery();

  useEffect(() => {
    if (Array.isArray(bodyType) && bodyType.length === 0) {
      const raw = (profile as any)?.bodyType ?? (profile as any)?.body_type;
      const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
      const first = arr.map((v: any) => toLabel(String(v))).find(Boolean);
      if (first) setBodyType([first]);
    }
  }, [bodyType, profile, setBodyType]);

  // 건너뛰기 누르면 상태 초기화하고 다음 페이지로 이동
  const handleSkip = () => {
    resetBodyType();
    router.push(`/mypage/user-info-edit/${indexToSlug[5]}`);
  };

  // 버튼 클릭 시 단일 선택 토글 방식으로 값 추가 또는 제거
  const handleClick = (item: string) => {
    const isSelected = bodyType.includes(item);
    if (isSelected)
      setBodyType([]); // 해제
    else setBodyType([item as Label]); // 단일 선택
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center">
      {/* 상단 진행 바 */}
      <ProgressBar
        currentStep={4}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      {/* 메인 영역 */}
      <main className="flex h-full w-full flex-col items-center px-4 py-6">
        <section className="mb-12 mt-20">
          <div className="whitespace-pre px-10 text-center text-3xl font-medium leading-relaxed">
            체질은 무엇인가요?
          </div>
        </section>

        {/* 선택 버튼 리스트 */}
        <section className="mt-10 w-full px-5">
          <div className="flex flex-col gap-5">
            {LABELS.map((item) => {
              const isSelected = bodyType.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`h-14 w-full rounded-md border-[1px] px-2 py-1 pt-1 text-lg ${
                    isSelected
                      ? "border-primary-normal bg-primary-normal text-white"
                      : "border-primary-normal bg-white text-primary-normal"
                  } `}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* 하단 버튼 영역 */}
      <footer className="absolute bottom-0 flex w-full flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between">
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[3]}`)
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

        {/* 저장 버튼 (선택 안 했으면 비활성화) */}
        <button
          onClick={() =>
            router.push(`/mypage/user-info-edit/${indexToSlug[5]}`)
          }
          disabled={bodyType.length === 0}
          className={`h-14 min-w-full rounded-t-md p-2.5 text-xl font-normal text-white ${
            bodyType.length === 0
              ? "cursor-not-allowed bg-[#A1A1A1]"
              : "bg-secondary-normal hover:bg-secondary-normalHover active:bg-secondary-normalActive"
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
