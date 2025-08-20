"use client";

import { useEffect, useMemo, useState } from "react";
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

const LABELS = ["여성", "남성"] as const;
const toLabelFromCode = (code?: string | null) =>
  code === "F" ? "여성" : code === "M" ? "남성" : "";

export default function GenderStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand 상태/액션
  const nickname = useOnboardingStore((s) => s.nickname);
  const profileImageUrl = useOnboardingStore((s) => s.profileImageUrl);
  const gender = useOnboardingStore((s) => s.gender); // ✅ 라벨("여성"|"남성")로 저장
  const setGender = useOnboardingStore((s) => s.setGender);
  const exercise = useOnboardingStore((s) => s.exercise);
  const prefer = useOnboardingStore((s) => s.prefer);
  const bodyType = useOnboardingStore((s) => s.bodyType);
  const allergy = useOnboardingStore((s) => s.allergy);
  const resetAll = useOnboardingStore((s) => s.reset);

  const { data: profile } = useProfileQuery();

  // ▶︎ 초기 하이드레이트: 스토어에 값이 없고 프로필에 있으면 라벨로 세팅
  useEffect(() => {
    if (!gender && profile?.gender) {
      const label =
        profile.gender === "여성" || profile.gender === "남성"
          ? (profile.gender as "여성" | "남성")
          : (toLabelFromCode(profile.gender) as "여성" | "남성" | "");
      if (label) setGender(label as any);
    }
  }, [gender, profile?.gender, setGender]);

  const activeLabel = useMemo(() => gender ?? "", [gender]);

  const handleGenderClick = (label: "남성" | "여성") => {
    // 같은 버튼 다시 누르면 해제(선택 토글)
    const next = activeLabel === label ? null : label;
    setGender(next as any);
  };

  // 저장: 현재 스토어 스냅샷을 부분 업데이트로 서버에 전송
  const queryClient = useQueryClient();
  const authUser = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const userKey =
    (authUser as any)?.id ??
    (authUser as any)?.email ??
    (accessToken ? "me" : "guest");

  const handleSave = async () => {
    if (!gender) return; // 선택 없으면 저장 안 함
    setSaving(true);
    setError(null);
    try {
      const snap = {
        nickname,
        profileImageUrl,
        gender,
        exercise,
        prefer,
        bodyType,
        allergy,
      };
      // 서버는 부분 업데이트 대신 전체 바디를 기대할 수 있으므로,
      // 현재 프로필(profile)과 스토어 스냅샷을 병합한 payload를 전송합니다.
      const payload = buildCompletePayloadFromStore(
        snap as any,
        profile as any,
      );
      const fullPayload = { email: (profile as any)?.email, ...payload } as any;
      if (process.env.NODE_ENV !== "production") {
        // 저장 전 최종 페이로드 확인

        console.log("[GenderStep] update payload =>", fullPayload);
      }
      await updateProfile(fullPayload);
      // 먼저 다음 스텝으로 이동시키고, 캐시 갱신은 백그라운드에서 처리합니다.
      router.replace(`/mypage/user-info-edit/${indexToSlug[2]}`);
      queryClient
        .invalidateQueries({ queryKey: ["profile", userKey], exact: true })
        .catch(() => {});
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401) {
        router.push(
          `/auth/sign-in?redirect=${encodeURIComponent(`/mypage/user-info-edit/${indexToSlug[1]}`)}`,
        );
        return;
      }
      const reason =
        e?.response?.data?.error?.reason ||
        e?.message ||
        "성별 저장에 실패했습니다.";
      setError(reason);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    setGender(null);
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
            {LABELS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => handleGenderClick(label)}
                className={`h-14 w-28 rounded-md border-[1px] px-2.5 pt-1 text-xl ${
                  activeLabel === label
                    ? "border-primary-normal bg-primary-normal text-white"
                    : "border-primary-normal bg-white text-primary-normal"
                } `}
                aria-pressed={activeLabel === label}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* 하단: 건너뛰기 / 저장 */}
      <section className="absolute bottom-0 flex w-full flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={handleSkip}
          className="mr-5 text-base text-grey-normalActive"
        >
          건너뛰기 {">"}
        </button>
        <button
          onClick={handleSave}
          disabled={!gender || saving}
          className={`h-14 min-w-full rounded-t-md p-2.5 text-xl font-normal text-white ${
            gender && !saving
              ? "bg-secondary-normal hover:bg-secondary-normalHover active:bg-secondary-normalActive"
              : "cursor-not-allowed bg-[#A1A1A1]"
          }`}
        >
          {saving ? "저장 중..." : "저장"}
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
              router.push("/mypage/user-info-edit");
            }}
            onClose={() => setShowModal(false)}
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
