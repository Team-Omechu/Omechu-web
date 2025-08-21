"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { resetBasicStateAndSync } from "../utils/resetBasicState";

const LABELS = ["여성", "남성"] as const;
const toLabelFromCode = (code?: string | null) =>
  code === "F" ? "여성" : code === "M" ? "남성" : "";

export default function GenderStep() {
  const hydratedRef = useRef(false);
  const userInteractedRef = useRef(false);

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand — 성별만 사용
  const gender = useOnboardingStore((s) => s.gender); // "여성" | "남성" | null
  const setGender = useOnboardingStore((s) => s.setGender);
  const setExercise = useOnboardingStore((s) => s.setExercise);
  const setPrefer = useOnboardingStore((s) => s.setPrefer);
  const setBodyType = useOnboardingStore((s) => s.setBodyType);
  const setAllergy = useOnboardingStore((s) => s.setAllergy);

  const { data: profile } = useProfileQuery();

  // 1회 하이드레이트 (사용자 상호작용 이후엔 차단)
  useEffect(() => {
    if (hydratedRef.current || userInteractedRef.current) return;
    if (!gender && profile?.gender) {
      const label =
        profile.gender === "여성" || profile.gender === "남성"
          ? (profile.gender as "여성" | "남성")
          : (toLabelFromCode(profile.gender) as "여성" | "남성" | "");
      if (label) {
        setGender(label as any);
        hydratedRef.current = true;
        if (process.env.NODE_ENV !== "production") {
          console.log("[GenderStep] hydrated from profile →", label);
        }
      }
    }
  }, [gender, profile?.gender, setGender]);

  const activeLabel = useMemo(() => gender ?? "", [gender]);

  const handleGenderClick = (label: "남성" | "여성") => {
    const next = activeLabel === label ? null : label;
    userInteractedRef.current = true;
    setGender(next as any);
  };

  // 저장: 성별만 전송
  const queryClient = useQueryClient();
  const authUser = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const userKey =
    (authUser as any)?.id ??
    (authUser as any)?.email ??
    (accessToken ? "me" : "guest");

  const handleSave = async () => {
    if (!gender) return;
    setSaving(true);
    setError(null);
    try {
      const snap = { gender }; //  성별만
      const payload = buildCompletePayloadFromStore(
        snap as any,
        profile as any,
      );
      const fullPayload = { email: (profile as any)?.email, ...payload } as any;

      if (process.env.NODE_ENV !== "production") {
        console.log("[GenderStep] update payload =>", fullPayload);
      }

      await updateProfile(fullPayload);

      router.replace(`/mypage/user-info-edit/${indexToSlug[2]}`);
      queryClient
        .invalidateQueries({ queryKey: ["profile", userKey], exact: true })
        .catch(() => {});
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401) {
        router.push(`/sign-in`);
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

  // 건너뛰기: gender만 null로 서버에 반영
  const handleSkip = async () => {
    userInteractedRef.current = true;
    setGender(null);
    if (process.env.NODE_ENV !== "production") {
      console.log("[GenderStep] skip → gender = null (block rehydrate)");
    }
    try {
      const snap = { gender: null } as any; //  성별만
      const payload = buildCompletePayloadFromStore(snap, profile as any);
      const fullPayload = { email: (profile as any)?.email, ...payload } as any;
      await updateProfile(fullPayload);
      queryClient
        .invalidateQueries({ queryKey: ["profile", userKey], exact: true })
        .catch(() => {});
    } catch {}
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
              ? "bg-secondary-normal active:bg-[#0182CA]"
              : "cursor-not-allowed bg-[#A1A1A1]"
          }`}
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </section>

      {showModal && (
        <ModalWrapper>
          <AlertModal
            title="기본 상태 입력을 중단하시겠어요?"
            description="지금까지 작성한 내용은 저장되지 않아요."
            confirmText="그만하기"
            cancelText="돌아가기"
            onConfirm={async () => {
              userInteractedRef.current = true;

              // 1) 로컬(Zustand) 초기화 — 닉네임은 건드리지 않음
              setGender(null);
              setExercise(null);
              setPrefer([]);
              setBodyType([]);
              setAllergy([]);

              // 2) 서버 동기화 (공통 헬퍼)
              await resetBasicStateAndSync(profile, queryClient, userKey);

              // 3) 이동
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
