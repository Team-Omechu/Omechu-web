"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { useProfileQuery } from "../../hooks/useProfileQuery";
import { updateProfile } from "@/mypage/api/updateProfile";
import { buildCompletePayloadFromStore } from "@/mypage/mappers/profilePayload";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/auth.store";

// 화면에서 사용할 라벨 상수 (스토어에는 라벨 문자열을 그대로 저장/토글)
const OPTIONS = [
  "달걀 (난류)",
  "유제품",
  "갑각류",
  "해산물",
  "견과류",
] as const;

export default function AllergyStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false); // 중단 모달
  const [showSaveModal, setShowSaveModal] = useState(false); // 제출 완료 모달
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand
  const allergies = useOnboardingStore((s) => s.allergy);
  const toggleAllergy = useOnboardingStore((s) => s.toggleAllergy);
  const setAllergy = useOnboardingStore((s) => s.setAllergy);
  const nickname = useOnboardingStore((s) => s.nickname);
  const gender = useOnboardingStore((s) => s.gender);
  const exercise = useOnboardingStore((s) => s.exercise);
  const prefer = useOnboardingStore((s) => s.prefer);
  const bodyType = useOnboardingStore((s) => s.bodyType);
  const profileImageUrl = useOnboardingStore((s) => s.profileImageUrl);

  // 프로필 연동 (초기 하이드레이트)
  const { data: profile } = useProfileQuery();
  useEffect(() => {
    if (
      allergies.length === 0 &&
      Array.isArray(profile?.allergy) &&
      profile!.allergy.length > 0
    ) {
      // 서버에서 온 값을 그대로 스토어 초기값으로 사용 (다중 선택 허용)
      setAllergy(profile!.allergy as string[]);
    }
  }, [allergies.length, profile?.allergy, setAllergy]);

  const queryClient = useQueryClient();
  const authUser = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const userKey =
    authUser?.id ?? authUser?.email ?? (accessToken ? "me" : "guest");

  const handleClick = (item: string) => {
    // 다중 선택: 존재하면 제거, 없으면 추가
    toggleAllergy(item);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = {
        nickname,
        profileImageUrl,
        gender,
        bodyType,
        exercise,
        prefer,
        allergy: allergies,
      };
      const payload = buildCompletePayloadFromStore(snap, profile);
      await updateProfile(payload);
      // 최신 프로필 쿼리 갱신
      queryClient.invalidateQueries({
        queryKey: ["profile", userKey],
        exact: true,
      });
      setShowSaveModal(true);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401) {
        router.push(
          `/auth/sign-in?redirect=${encodeURIComponent("/mypage/user-info-edit/allergy")}`,
        );
        return;
      }
      const reason =
        e?.response?.data?.error?.reason ||
        e?.message ||
        "저장에 실패했습니다.";
      setError(reason);
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
      <main className="flex min-h-[calc(100vh-9rem)] w-full flex-col items-center px-4 pb-28 pt-6">
        <section className="mb-8 mt-20 text-center">
          <div className="whitespace-pre px-10 text-3xl font-medium leading-relaxed">
            알레르기가 있나요?
          </div>
        </section>

        {/* 선택 버튼들 */}
        <section className="my-10">
          <div className="flex flex-col gap-5">
            {OPTIONS.map((item) => {
              const isSelected = allergies.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleClick(item)}
                  aria-pressed={isSelected}
                  className={`h-14 w-60 rounded-md border-[1px] p-2 pt-2.5 text-xl transition-colors ${
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
          type="button"
          onClick={handleSubmit}
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
