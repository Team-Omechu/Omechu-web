"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { useProfileQuery } from "../../hooks/useProfileQuery";
import { useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/mypage/api/updateProfile";
import { buildCompletePayloadFromStore } from "@/mypage/mappers/profilePayload";
import { useAuthStore } from "@/lib/stores/auth.store";
import { resetBasicStateAndSync } from "../utils/resetBasicState";

// 스펙 라벨 그대로 사용
const LABELS = ["다이어트 중", "증량 중", "유지 중"] as const;

type Label = (typeof LABELS)[number];

export default function StateStep() {
  const hydratedRef = useRef(false);
  const userInteractedRef = useRef(false);

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand에서 상태와 초기화 함수들 가져옴 (라벨 그대로 저장)
  const exercise = useOnboardingStore((s) => s.exercise); // "다이어트 중" | "증량 중" | "유지 중" | null
  const setExercise = useOnboardingStore((s) => s.setExercise);
  const setGender = useOnboardingStore((s) => s.setGender);
  const setPrefer = useOnboardingStore((s) => s.setPrefer);
  const setBodyType = useOnboardingStore((s) => s.setBodyType);
  const setAllergy = useOnboardingStore((s) => s.setAllergy);

  // 다른 스텝에서 필요한 스토어 스냅샷도 함께 읽음 (서버 저장용)
  const nickname = useOnboardingStore((s) => s.nickname);
  const profileImageUrl = useOnboardingStore((s) => s.profileImageUrl);
  const gender = useOnboardingStore((s) => s.gender);
  const prefer = useOnboardingStore((s) => s.prefer);
  const bodyType = useOnboardingStore((s) => s.bodyType);
  const allergy = useOnboardingStore((s) => s.allergy);

  const { data: profile } = useProfileQuery();

  // 프로필에 운동 상태가 있고 스토어가 비어 있으면 초기 하이드레이트 (라벨 그대로)
  useEffect(() => {
    if (hydratedRef.current || userInteractedRef.current) return;
    if (!exercise && profile?.exercise) {
      if (
        profile.exercise === "다이어트 중" ||
        profile.exercise === "증량 중" ||
        profile.exercise === "유지 중"
      ) {
        setExercise(profile.exercise as Label);
        hydratedRef.current = true;
        if (process.env.NODE_ENV !== "production") {
          console.log("[StateStep] hydrated from profile →", profile.exercise);
        }
      }
    }
  }, [exercise, profile?.exercise, setExercise]);

  const activeLabel = useMemo(() => exercise ?? "", [exercise]);

  const handleStatusClick = (label: Label) => {
    const next = activeLabel === label ? null : label;
    userInteractedRef.current = true;
    setExercise(next as any);
  };

  // 저장 로직: 서버에 저장 후 다음 스텝으로 이동(선호 음식)
  const queryClient = useQueryClient();
  const authUser = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const userKey =
    (authUser as any)?.id ??
    (authUser as any)?.email ??
    (accessToken ? "me" : "guest");

  const handleSave = async () => {
    if (!exercise) return;
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
      const payload = buildCompletePayloadFromStore(
        snap as any,
        profile as any,
      );
      const fullPayload = { email: (profile as any)?.email, ...payload } as any;
      if (process.env.NODE_ENV !== "production") {
        console.log("[StateStep] update payload =>", fullPayload);
      }
      await updateProfile(fullPayload);
      // 다음 스텝(선호 음식)으로 이동, 캐시 무효화는 백그라운드 처리
      router.replace(`/mypage/user-info-edit/${indexToSlug[3]}`);
      queryClient
        .invalidateQueries({ queryKey: ["profile", userKey], exact: true })
        .catch(() => {});
    } catch (e: any) {
      const reason =
        e?.response?.data?.error?.reason ||
        e?.message ||
        "운동 상태 저장에 실패했습니다.";
      setError(reason);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    userInteractedRef.current = true;
    setExercise(null);
    try {
      const snap = {
        nickname,
        profileImageUrl,
        gender,
        exercise: null, // ← 명시적으로 null 전송
        prefer,
        bodyType,
        allergy,
      };
      const payload = buildCompletePayloadFromStore(
        snap as any,
        profile as any,
      );
      const fullPayload = { email: (profile as any)?.email, ...payload } as any;
      if (process.env.NODE_ENV !== "production") {
        console.log("[StateStep] skip payload =>", fullPayload);
      }
      await updateProfile(fullPayload);
      queryClient
        .invalidateQueries({ queryKey: ["profile", userKey], exact: true })
        .catch(() => {});
      queryClient
        .invalidateQueries({ queryKey: ["profile"], exact: true })
        .catch(() => {});
    } catch (e) {
      // 무시하고 다음 단계로 이동
    }
    router.push(`/mypage/user-info-edit/${indexToSlug[3]}`);
  };

  return (
    <div className="relative flex min-h-screen w-auto flex-col">
      <ProgressBar
        currentStep={2}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      <main className="flex h-full w-full flex-col items-center px-4 py-6">
        <section className="mb-16 mt-28">
          <div className="whitespace-pre px-10 text-center text-3xl font-medium leading-relaxed">
            {`지금 어떤 운동 상태에
가까운가요?`}
          </div>
        </section>

        <section className="flex flex-col items-center justify-center">
          <div className="z-10 flex flex-col gap-5">
            {LABELS.map((label) => (
              <button
                key={`${label}-${activeLabel === label}`}
                onClick={() => handleStatusClick(label)}
                className={`h-12 w-60 rounded-md border px-2 text-xl ${
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

      <footer className="absolute bottom-0 flex w-full flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between">
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[1]}`)
            }
            className="ml-5 text-base text-grey-normal-active"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={handleSkip}
            className="mr-5 text-base text-grey-normal-active"
          >
            건너뛰기 {">"}
          </button>
        </div>

        {/* 저장 버튼: 선택 없으면 비활성화 */}
        <button
          onClick={handleSave}
          disabled={!exercise || saving}
          className={`h-14 min-w-full rounded-t-md p-2.5 text-xl font-normal text-white ${
            exercise && !saving
              ? "bg-secondary-normal active:bg-[#0182CA]"
              : "cursor-not-allowed bg-[#A1A1A1]"
          }`}
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </footer>

      {/* 중단 모달 */}
      {showModal && (
        <ModalWrapper>
          <AlertModal
            title="기본 상태 입력을 중단하시겠어요?"
            description="지금까지 작성한 내용은 저장되지 않아요."
            confirmText="그만하기"
            cancelText="돌아가기"
            onConfirm={async () => {
              // 1) 로컬(Zustand)에서 닉네임 제외 초기화 + 즉시 UI 반영(버튼 선택 해제)
              userInteractedRef.current = true;
              setGender(null);
              setExercise(null);
              setPrefer([]);
              setBodyType([]);
              setAllergy([]);

              // Optimistic cache update to avoid re-hydrating old profile on previous steps
              queryClient.setQueryData(["profile", userKey], (prev: any) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  gender: null,
                  exercise: null,
                  prefer: [],
                  body_type: [],
                  allergy: [],
                };
              });
              queryClient.setQueryData(["profile"], (prev: any) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  gender: null,
                  exercise: null,
                  prefer: [],
                  body_type: null,
                  allergy: [],
                };
              });

              // 2) 서버에도 동기화 (닉네임/이미지는 mapper가 기존값 보존)
              try {
                await resetBasicStateAndSync(
                  profile as any,
                  queryClient,
                  userKey,
                );
                await queryClient
                  .invalidateQueries({ queryKey: ["profile"], exact: true })
                  .catch(() => {});
              } catch (e) {
                if (process.env.NODE_ENV !== "production") {
                  console.error("[StateStep] reset(confirm) failed:", e);
                }
              }

              // 3) 모달 닫고 최초 화면으로 이동
              setShowModal(false);
              router.push(`/mypage/user-info-edit`);
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
