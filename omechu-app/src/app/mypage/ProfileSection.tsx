"use client";

import { useProfileQuery } from "./hooks/useProfileQuery";
import AuthErrorModalSection from "./AuthErrorModalSection";
import { useEffect, useMemo, useState, useRef } from "react";
import { LoadingSpinner } from "@/components/common/LoadingIndicator";
import { useRouter, usePathname } from "next/navigation";

// 401/403 → 인증 만료로 판단하여 모달 표시
// 그 외 에러는 재시도 UI로 처리

type ProfileApiErrorLike = Error & { code?: number };

export default function ProfileSection() {
  const {
    data: profile,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useProfileQuery();

  if (typeof window !== "undefined") {
    // 진단 로그: 현재 상태 트레이스
    console.log("[ProfileSection] state", {
      isLoading,
      isFetching,
      hasProfile: Boolean(profile),
      error,
    });
  }

  const nickname = useMemo(() => profile?.nickname ?? "-", [profile?.nickname]);
  const profileImageUrl = useMemo(
    () => profile?.profileImageUrl ?? "/profile/profile_default_img.svg",
    [profile?.profileImageUrl],
  );
  const isDefaultImg = useMemo(
    () => /\/profile\/profile_default_img/i.test(profileImageUrl),
    [profileImageUrl],
  );

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 로딩 스턱 감지용(3초 넘게 isLoading이면 강제 분기)
  const [stuck, setStuck] = useState(false);
  const stuckTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 스피너가 장시간 지속되면 stuck 처리
    if (isLoading && !profile && !stuck) {
      if (!stuckTimerRef.current) {
        stuckTimerRef.current = setTimeout(() => {
          setStuck(true);
        }, 2000);
      }
    } else {
      if (stuckTimerRef.current) {
        clearTimeout(stuckTimerRef.current);
        stuckTimerRef.current = null;
      }
      if (!isLoading) setStuck(false);
    }
    return () => {
      if (stuckTimerRef.current) {
        clearTimeout(stuckTimerRef.current);
        stuckTimerRef.current = null;
      }
    };
  }, [isLoading, profile, stuck]);

  const isAuthError = useMemo(() => {
    const e = error as ProfileApiErrorLike | undefined;
    const code = e?.code ?? (e as any)?.response?.status;
    return code === 401 || code === 403;
  }, [error]);

  useEffect(() => {
    if (!isLoading && isAuthError) setAuthModalOpen(true);
    if (!isLoading && !error) setAuthModalOpen(false);
  }, [isLoading, isAuthError, error]);

  // 1) 인증 오류 모달 우선
  if (authModalOpen) {
    return (
      <section className="flex flex-col items-center gap-3 py-6">
        <AuthErrorModalSection
          isOpen={authModalOpen}
          onConfirm={() => {
            setAuthModalOpen(false);
            router.push("/sign-in");
          }}
          onClose={() => setAuthModalOpen(false)}
        />
      </section>
    );
  }

  // 2) 로딩: 캐시/데이터가 전혀 없을 때만 스피너 노출
  if (isLoading && !profile) {
    if (stuck) {
      return (
        <section className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-base">
            로딩이 오래 걸리고 있어요. 다시 시도해볼까요?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setStuck(false);
                refetch();
              }}
              className="rounded-md border px-3 py-2 text-sm"
            >
              다시 시도
            </button>
            <button
              type="button"
              onClick={() => {
                setStuck(false);
                // 캐시 무시 새로고침
                router.refresh();
              }}
              className="rounded-md border px-3 py-2 text-sm"
            >
              새로고침
            </button>
          </div>
        </section>
      );
    }
    return (
      <main className="h-fit">
        <LoadingSpinner label="프로필 정보 불러오는 중..." />
      </main>
    );
  }

  // 3) 일반 오류 (네트워크 등): 재시도 제공
  if (error && !authModalOpen) {
    return (
      <section className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-base text-red-500">
          프로필 정보를 불러오지 못했어요.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md border px-3 py-2 text-sm"
        >
          다시 시도
        </button>
      </section>
    );
  }

  // 4) 정상 렌더 — 데이터가 비어도 플레이스홀더 안전 표시, 백그라운드 동기화는 isFetching으로 안내
  return (
    <section className="flex flex-col items-center gap-1">
      <div
        className={
          isDefaultImg
            ? "relative h-[90px] w-[90px] overflow-hidden rounded-full"
            : "relative h-[130px] w-[130px] overflow-hidden rounded-full"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profileImageUrl}
          alt="프로필 이미지"
          className={
            isDefaultImg
              ? "h-full w-full object-contain p-2"
              : "h-full w-full object-cover"
          }
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (/\.PNG$/i.test(img.src)) {
              img.src = img.src.replace(/\.PNG$/i, ".png");
              return;
            }
            img.src = "/profile/profile_default_img.svg";
          }}
        />
      </div>
      <div className="mt-3 text-2xl font-semibold">{nickname}</div>
      <div className="text-lg font-normal text-grey-normal-active">
        {profile?.email || ""}
      </div>
      <div className="mt-1 text-xs text-grey-normal">
        {isFetching ? "동기화 중..." : ""}
      </div>
    </section>
  );
}
