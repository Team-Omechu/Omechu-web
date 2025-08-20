"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import ProgressBar from "@/components/common/ProgressBar";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { useProfileQuery } from "../../hooks/useProfileQuery";
import { updateProfile } from "@/mypage/api/updateProfile";
import { buildCompletePayloadFromStore } from "@/mypage/mappers/profilePayload";
import { useAuthStore } from "@/lib/stores/auth.store";

// ✅ 스펙 라벨 통일: "다른나라"(기존 "다른나라 음식" 제거)
const FOOD_LABELS = ["한식", "양식", "중식", "일식", "다른나라"] as const;

type FoodLabel = (typeof FOOD_LABELS)[number];

// 다양한 입력(코드/옛 라벨)을 스펙 라벨로 정규화
const labelFromAny = (v?: string | null) => {
  if (!v) return "";
  const s = String(v).trim();
  if ((FOOD_LABELS as readonly string[]).includes(s)) return s as FoodLabel;
  const u = s.toUpperCase();
  if (u === "KOR") return "한식";
  if (u === "WES" || u === "WESTERN") return "양식";
  if (u === "CHI" || u === "CHINESE") return "중식";
  if (u === "JPN" || u === "JAPANESE") return "일식";
  if (s.includes("다른나라")) return "다른나라"; // "다른나라 음식" 등 과거 표기 호환
  return "다른나라";
};

export default function FoodStep() {
  const hydratedRef = useRef(false);
  const userInteractedRef = useRef(false);

  const router = useRouter();
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand 상태/액션 (다음 스텝 저장을 위해 스냅샷도 함께 읽음)
  const prefer = useOnboardingStore((s) => s.prefer);
  const setPrefer = useOnboardingStore((s) => s.setPrefer);
  const togglePrefer = useOnboardingStore((s) => s.togglePrefer);
  const resetPrefer = useOnboardingStore((s) => s.resetPrefer);
  const resetAll = useOnboardingStore((s) => s.reset);

  const preferHydrateBlocked = useOnboardingStore(
    (s) => s.preferHydrateBlocked,
  );
  const blockPreferHydrate = useOnboardingStore((s) => s.blockPreferHydrate);

  const nickname = useOnboardingStore((s) => s.nickname);
  const profileImageUrl = useOnboardingStore((s) => s.profileImageUrl);
  const gender = useOnboardingStore((s) => s.gender);
  const exercise = useOnboardingStore((s) => s.exercise);
  const bodyType = useOnboardingStore((s) => s.bodyType);
  const allergy = useOnboardingStore((s) => s.allergy);

  const { data: profile } = useProfileQuery();
  const authUser = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const userKey =
    (authUser as any)?.id ??
    (authUser as any)?.email ??
    (accessToken ? "me" : "guest");

  // ▶︎ 프로필로부터 초기 하이드레이트 (스토어 비어 있을 때만)
  useEffect(() => {
    if (
      preferHydrateBlocked ||
      hydratedRef.current ||
      userInteractedRef.current
    )
      return;
    if (preferHydrateBlocked && process.env.NODE_ENV !== "production") {
      console.log("[FoodStep] hydrate blocked by store flag");
    }
    if (
      prefer.length === 0 &&
      Array.isArray(profile?.prefer) &&
      profile!.prefer.length > 0
    ) {
      const mapped = (profile!.prefer as any[])
        .map((x) => labelFromAny(String(x)))
        .filter(Boolean) as FoodLabel[];
      const unique = Array.from(new Set(mapped)).slice(0, 2) as FoodLabel[]; // 최대 2개 정책 유지
      if (unique.length > 0) {
        setPrefer(unique);
        hydratedRef.current = true;
        if (process.env.NODE_ENV !== "production") {
          console.log("[FoodStep] hydrated from profile:", unique);
        }
      }
    }
  }, [prefer.length, profile?.prefer, setPrefer, preferHydrateBlocked]);

  // 버튼 토글 (최대 2개 선택)
  const handleClick = (item: FoodLabel) => {
    userInteractedRef.current = true;
    blockPreferHydrate();
    const isSelected = prefer.includes(item);
    if (isSelected || prefer.length < 2) {
      togglePrefer(item);
    }
  };

  const activeSet = useMemo(() => new Set(prefer), [prefer]);

  const handleSkip = async () => {
    // null semantics for array-type field: use empty array
    userInteractedRef.current = true;
    blockPreferHydrate();
    setPrefer([]);
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[FoodStep] skip → prefer = [] (null semantics); block rehydrate (persisted)",
      );
    }

    try {
      const snap = {
        nickname,
        profileImageUrl,
        gender,
        exercise,
        prefer: [], // <- 서버 동기화는 빈 배열로 보냄
        bodyType,
        allergy,
      };
      const payload = buildCompletePayloadFromStore(
        snap as any,
        profile as any,
      );
      const fullPayload = { email: (profile as any)?.email, ...payload } as any;
      updateProfile(fullPayload)
        .then(() =>
          qc
            .invalidateQueries({ queryKey: ["profile", userKey], exact: true })
            .catch(() => {}),
        )
        .catch(() => {});
    } catch {}

    router.push(`/mypage/user-info-edit/${indexToSlug[4]}`); // 다음: body_type
  };

  const handleSave = async () => {
    if (prefer.length === 0 || saving) return;
    setSaving(true);
    setError(null);
    try {
      // 서버에 저장(스토어+프로필 병합 → full payload) 후 다음 스텝으로 이동
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

      await updateProfile(fullPayload);
      router.replace(`/mypage/user-info-edit/${indexToSlug[4]}`); // 다음: body_type
      qc.invalidateQueries({
        queryKey: ["profile", userKey],
        exact: true,
      }).catch(() => {});
    } catch (e: any) {
      const reason =
        e?.response?.data?.error?.reason ||
        e?.message ||
        "선호 음식 저장에 실패했습니다.";
      setError(reason);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-auto flex-col">
      <ProgressBar
        currentStep={3}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      <main className="flex h-full w-full flex-col items-center px-4 py-6">
        <section className="mb-12 mt-20">
          <div className="whitespace-pre px-10 text-center text-3xl font-medium leading-relaxed">
            평소 자주 먹거나 좋아하는{"\n"}
            음식이 있나요?
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-5">
            {FOOD_LABELS.map((item) => {
              // 빈 배열일 때는 어떤 버튼도 선택되지 않도록 강제
              const isSelected = prefer.length > 0 && activeSet.has(item);
              const isDisabled = !isSelected && prefer.length >= 2;
              return (
                <button
                  key={`${item}-${isSelected ? "1" : "0"}`}
                  type="button"
                  onClick={() => {
                    if (!isDisabled) handleClick(item);
                  }}
                  className={`h-14 w-60 rounded-md border-[1px] p-2 pt-2.5 text-xl transition ${
                    isSelected
                      ? "border-primary-normal bg-primary-normal text-white"
                      : "border-primary-normal bg-white text-primary-normal"
                  }`}
                  aria-pressed={isSelected}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="absolute bottom-0 flex w-full flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between">
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[2]}`)
            }
            className="ml-5 text-base text-grey-normalActive dark:font-semibold"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={handleSkip}
            className="mr-5 text-base text-grey-normalActive dark:font-semibold"
          >
            건너뛰기 {">"}
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={prefer.length === 0 || saving}
          className={`h-14 min-w-full rounded-t-md p-2.5 text-xl font-normal text-white ${
            prefer.length === 0 || saving
              ? "cursor-not-allowed bg-[#A1A1A1] dark:bg-[#555]"
              : "bg-secondary-normal hover:bg-secondary-normalHover active:bg-secondary-normalActive"
          }`}
          aria-busy={saving}
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </footer>

      {error && (
        <div className="absolute bottom-24 left-0 right-0 text-center text-red-600">
          {error}
        </div>
      )}

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
