"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

export default function AllergyStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false); // 중단 모달
  const [showSaveModal, setShowSaveModal] = useState(false); // 제출 완료 모달
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand에서 알레르기 관련 상태랑 토글 함수 가져옴
  // AllergyStep.tsx 상단, useOnboardingStore로 전체 상태 가져오기
  const nickname = useOnboardingStore((state) => state.nickname);
  const gender = useOnboardingStore((state) => state.gender);
  const workoutStatus = useOnboardingStore((state) => state.workoutStatus);
  const preferredFood = useOnboardingStore((state) => state.preferredFood);
  const constitution = useOnboardingStore((state) => state.constitution);
  const allergies = useOnboardingStore((state) => state.allergies);
  const profileImageUrl = useOnboardingStore((state) => state.profileImageUrl); // 예시

  const toggleAllergy = useOnboardingStore((state) => state.toggleAllergy);

  // 버튼 클릭하면 선택/해제
  const handleClick = (item: string) => {
    toggleAllergy(item);
  };

  // 프로필 업데이트 API 호출 함수
  const updateProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        nickname,
        gender,
        exercise: workoutStatus,
        prefer: preferredFood.length === 0 ? ["없음"] : preferredFood,
        constitution: constitution.length === 0 ? ["없음"] : constitution,
        allergy: allergies.length === 0 ? ["없음"] : allergies,
      };

      const response = await apiClient.patch("/profile", requestBody);
      console.log("프로필 업데이트 성공:", response.data);

      setShowSaveModal(true);
    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
      setError("프로필 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-auto flex-col">
      {/* 상단 진행 바 */}
      <ProgressBar
        currentStep={5}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      {/* 본문 영역 */}
      <main className="flex min-h-[calc(100vh-9rem)] w-full flex-col items-center px-4 py-6">
        <section className="mb-8 mt-20">
          <div className="whitespace-pre px-10 text-center text-3xl font-medium leading-relaxed">
            알레르기가 있나요?
          </div>
        </section>

        {/* 선택 버튼들 */}
        <section className="my-10">
          <div className="flex flex-col gap-5">
            {["달걀 (난류)", "유제품", "갑각류", "해산물", "견과류"].map(
              (item) => {
                const isSelected = allergies.includes(item);

                return (
                  <button
                    key={`${item}-${isSelected}`}
                    onClick={() => handleClick(item)}
                    className={`h-14 w-60 rounded-md border-[1px] p-2 pt-2.5 text-xl ${
                      isSelected
                        ? "border-primary-normal bg-primary-normal text-white"
                        : "border-primary-normal bg-white text-primary-normal hover:bg-primary-normalHover hover:text-white"
                    } `}
                  >
                    {item}
                  </button>
                );
              },
            )}
          </div>
        </section>
      </main>

      {/* 하단 버튼들 */}
      <footer className="absolute bottom-0 flex w-full flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between">
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[4]}`)
            }
            className="ml-5 text-base text-grey-normalActive dark:font-semibold dark:text-white"
          >
            {"<"} 이전으로
          </button>
        </div>

        {/* 제출 버튼 */}
        <button
          onClick={updateProfile}
          disabled={loading}
          className="h-14 min-w-full rounded-t-md bg-secondary-normal p-2.5 text-xl font-normal text-white hover:bg-secondary-normalHover active:bg-secondary-normalActive disabled:opacity-50"
        >
          {loading ? "저장 중..." : "제출하기"}
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
              setShowModal(false);
              router.push(`/mypage/user-info-edit`);
            }}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}

      {/* 저장 완료 모달 */}
      {showSaveModal && (
        <ModalWrapper>
          <AlertModal
            title={
              allergies.length === 0 ? "알레르기가 없으신가요?" : "저장 완료!"
            }
            description={
              allergies.length === 0
                ? "입력 없이 제출할 경우, '없음'으로 저장됩니다."
                : "이제 맛있는 메뉴 추천 받아 볼까요?"
            }
            confirmText="추천 받기"
            onConfirm={() => {
              setShowSaveModal(false);
              router.push(`/mainpage`);
            }}
          />
        </ModalWrapper>
      )}

      {error && (
        <div className="absolute bottom-24 left-0 right-0 text-center text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
