"use client";

import { useProfileQuery } from "./hooks/useProfileQuery";
import AuthErrorModalSection from "./AuthErrorModalSection";
import { useEffect, useMemo, useState, useCallback } from "react";
import { LoadingSpinner } from "@/components/common/LoadingIndicator";
import { useRouter, usePathname } from "next/navigation";

// NOTE: fetchProfile()에서 ProfileApiError(code) 를 던지므로 여기서 분기 처리
// code: 401/403 이면 로그인 만료로 간주하고 모달을 띄운다.

type ProfileApiErrorLike = Error & { code?: number };

export default function ProfileSection() {
  const { data: profile, isLoading, error, refetch } = useProfileQuery();

  const nickname = useMemo(() => profile?.nickname ?? "-", [profile?.nickname]);
  const profileImageUrl = useMemo(
    () => profile?.profileImageUrl ?? "/profile/profile_default_img.svg",
    [profile?.profileImageUrl],
  );

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 1) 인증 오류면 모달, 그 외 오류면 에러 블록
  const isAuthError = useMemo(() => {
    const e = error as ProfileApiErrorLike | undefined;
    const code = e?.code ?? (e as any)?.response?.status; // 안전 가드
    return code === 401 || code === 403;
  }, [error]);

  useEffect(() => {
    if (!isLoading && isAuthError) {
      setAuthModalOpen(true);
    } else if (!isLoading && !error) {
      setAuthModalOpen(false);
    }
  }, [isLoading, isAuthError, error]);

  // Guard: if not loading, no error, but no profile data, render empty placeholder
  if (!isLoading && !error && !profile) {
    return (
      <section className="flex flex-col items-center gap-1 py-6">-</section>
    );
  }

  // 2) 로딩
  if (isLoading) {
    return (
      <main className="h-fit">
        <LoadingSpinner
          label="프로필 정보 불러오는 중..."
          className="mb-12 mt-7"
        />
      </main>
    );
  }

  // 3) 인증 오류 모달
  if (authModalOpen) {
    return (
      <section className="flex flex-col items-center gap-3 py-6">
        <AuthErrorModalSection
          isOpen={authModalOpen}
          onConfirm={() => {
            setAuthModalOpen(false);
            const to = encodeURIComponent(pathname || "/mypage");
            router.push(`/auth/sign-in?redirect=${to}`);
          }}
          onClose={() => setAuthModalOpen(false)}
        />
      </section>
    );
  }

  // 4) 일반 오류 (네트워크 등) — 사용자에게 재시도 제공
  if (error && !authModalOpen) {
    return (
      <section className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-base text-red-500">
          프로필 정보를 불러오지 못했어요.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-3 py-2 text-sm border rounded-md"
        >
          다시 시도
        </button>
      </section>
    );
  }

  // 5) 정상 렌더 — 데이터가 비어도 플레이스홀더를 안전하게 표시
  return (
    <section className="flex flex-col items-center gap-1">
      <div className="relative h-[130px] w-[130px] overflow-hidden rounded-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profileImageUrl}
          alt="프로필 이미지"
          className="object-cover w-full h-full"
          onError={(e) => {
            // 이미지 깨질 때 기본 이미지로 대체
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
      <div className="text-lg font-normal text-grey-normalActive">
        {profile?.email || ""}
      </div>
    </section>
  );
}
