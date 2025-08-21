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

// ✅ 서버 스펙 라벨(스토어에는 이 값으로 저장)
const BODY_LABELS = ["감기", "소화불량", "더위잘탐", "추위잘탐"] as const;
type BodyLabel = (typeof BODY_LABELS)[number];

// 화면 표시용 문구 매핑
const BODY_UI: Record<BodyLabel, string> = {
  감기: "감기에 잘 걸리는 편이에요",
  소화불량: "소화가 잘 안되는 날이 많아요",
  더위잘탐: "열이 많아서 더위를 잘 타요",
  추위잘탐: "추위를 잘 타고 몸이 쉽게 차가워져요",
};

// 다양한 과거 표기를 스펙 라벨로 정규화
const toLabel = (codeOrLabel?: string | null): BodyLabel | "" => {
  if (!codeOrLabel) return "";
  const s = String(codeOrLabel).trim();
  if ((BODY_LABELS as readonly string[]).includes(s as BodyLabel))
    return s as BodyLabel;
  const u = s.toUpperCase();
  if (u.includes("COLD") || u.includes("CATCH")) return "감기";
  if (u.includes("DIGEST")) return "소화불량";
  if (u.includes("HEAT") || u.includes("HOT")) return "더위잘탐";
  if (u.includes("CHILL") || u.includes("COLDNESS")) return "추위잘탐";
  // UI 긴 문구 대응
  if (s.includes("감기")) return "감기";
  if (s.includes("소화")) return "소화불량";
  if (s.includes("더위")) return "더위잘탐";
  if (s.includes("추위")) return "추위잘탐";
  return "";
};

export default function ConditionStep() {
  const hydratedRef = useRef(false);
  const userInteractedRef = useRef(false);

  const router = useRouter();
  const qc = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 스토어 스냅샷 (서버 저장용으로 함께 사용)
  const nickname = useOnboardingStore((s) => s.nickname);
  const profileImageUrl = useOnboardingStore((s) => s.profileImageUrl);
  const gender = useOnboardingStore((s) => s.gender);
  const exercise = useOnboardingStore((s) => s.exercise);
  const prefer = useOnboardingStore((s) => s.prefer);
  const bodyType = useOnboardingStore((s) => s.bodyType); // 배열, 첫 번째만 사용
  const allergy = useOnboardingStore((s) => s.allergy);

  const setBodyType = useOnboardingStore((s) => s.setBodyType);
  const resetBodyType = useOnboardingStore((s) => s.resetBodyType);
  const resetAll = useOnboardingStore((s) => s.reset);

  const { data: profile } = useProfileQuery();
  const authUser = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const userKey =
    (authUser as any)?.id ??
    (authUser as any)?.email ??
    (accessToken ? "me" : "guest");

  // 마운트/상태 디버그
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[ConditionStep] mount", {
        store: { nickname, gender, exercise, prefer, bodyType, allergy },
        profile,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // profile의 body_type/camelCase를 한 번에 참조 (deps에서 타입 오류 방지)
  const rawBodyType = (profile as any)?.body_type ?? (profile as any)?.bodyType;

  // ▶︎ 초기 하이드레이트: 스토어가 비었고, 사용자 상호작용 전 1회만
  useEffect(() => {
    if (hydratedRef.current || userInteractedRef.current) return;
    if ((bodyType?.length ?? 0) === 0) {
      const raw = rawBodyType;
      if (process.env.NODE_ENV !== "production") {
        console.log("[ConditionStep] hydrate check", { raw });
      }
      const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
      const first = arr.map((v: any) => toLabel(String(v))).find(Boolean);
      if (first) {
        setBodyType([first as BodyLabel]);
        hydratedRef.current = true;
        if (process.env.NODE_ENV !== "production") {
          console.log("[ConditionStep] hydrated from profile:", first);
        }
      }
    }
  }, [bodyType?.length, rawBodyType, setBodyType]);

  const active = useMemo(
    () => (bodyType?.[0] as BodyLabel | undefined) ?? undefined,
    [bodyType],
  );

  const handleClick = (label: BodyLabel) => {
    userInteractedRef.current = true;
    const next = active === label ? [] : [label];
    setBodyType(next);
    if (process.env.NODE_ENV !== "production") {
      console.log("[ConditionStep] select:", next);
    }
  };

  const handleSkip = async () => {
    userInteractedRef.current = true;
    setBodyType([]);
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[ConditionStep] skip → bodyType = [] (null semantics); block rehydrate",
      );
    }

    try {
      const snap = {
        nickname,
        profileImageUrl,
        gender,
        exercise,
        prefer,
        bodyType: [], // 빈 배열 → 매퍼에서 body_type:null 로 변환
        allergy,
      };
      const payload = buildCompletePayloadFromStore(
        snap as any,
        profile as any,
      );
      const fullPayload = { email: (profile as any)?.email, ...payload } as any;
      if (process.env.NODE_ENV !== "production") {
        console.log("[ConditionStep] skip payload =>", fullPayload);
      }
      await updateProfile(fullPayload);
      qc.invalidateQueries({
        queryKey: ["profile", userKey],
        exact: true,
      }).catch(() => {});
    } catch (e) {
      // 실패해도 다음 단계로 진행
    }

    router.push(`/mypage/user-info-edit/${indexToSlug[5]}`); // 다음: allergy
  };

  const handleSave = async () => {
    if (!active || saving) return;
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
        console.log("[ConditionStep] payload =>", fullPayload);
      }

      const res = await updateProfile(fullPayload);
      if (process.env.NODE_ENV !== "production") {
        console.log("[ConditionStep] save success:", res);
      }

      // 저장 성공 → 다음 스텝으로 즉시 이동, 캐시 무효화는 비동기 처리
      router.replace(`/mypage/user-info-edit/${indexToSlug[5]}`);
      qc.invalidateQueries({
        queryKey: ["profile", userKey],
        exact: true,
      }).catch(() => {});
    } catch (e: any) {
      const reason =
        e?.response?.data?.error?.reason ||
        e?.message ||
        "체질 저장에 실패했습니다.";
      setError(reason);
      if (process.env.NODE_ENV !== "production") {
        console.error("[ConditionStep] save error:", e);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center">
      <ProgressBar
        currentStep={4}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
        cancelButtonAlign="left"
      />

      <main className="flex h-full w-full flex-col items-center px-4 py-6">
        <section className="mb-12 mt-20">
          <div className="whitespace-pre px-10 text-center text-3xl font-medium leading-relaxed">
            체질은 무엇인가요?
          </div>
        </section>

        <section className="mt-10 w-full px-5">
          <div className="flex flex-col gap-5">
            {BODY_LABELS.map((label) => {
              const isSelected = active === label;
              return (
                <button
                  key={label}
                  onClick={() => handleClick(label)}
                  className={`h-14 w-full rounded-md border-[1px] px-2 py-1 pt-1 text-lg ${
                    isSelected
                      ? "border-primary-normal bg-primary-normal text-white"
                      : "border-primary-normal bg-white text-primary-normal"
                  } `}
                  aria-pressed={isSelected}
                >
                  {BODY_UI[label]}
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

        <button
          onClick={handleSave}
          disabled={!active || saving}
          className={`h-14 min-w-full rounded-t-md p-2.5 text-xl font-normal text-white ${
            !active || saving
              ? "cursor-not-allowed bg-[#A1A1A1]"
              : "bg-secondary-normal active:bg-[#0182CA]"
          }`}
          aria-busy={saving}
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </footer>

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

      {error && (
        <div className="absolute bottom-24 left-0 right-0 text-center text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
