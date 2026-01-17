"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useProfile } from "@/entities/user/lib/hooks/useProfile";
import { logout } from "@/entities/user/api/authApi";
import { useAuthStore } from "@/entities/user/model/auth.store";

import AlertModal from "@/shared/ui/modal/AlertModal";
import { Header } from "@/shared/ui/header/Header";
import { ModalWrapper } from "@/shared/ui/modal/ModalWrapper";
import { Toast } from "@/shared/ui/toast/Toast";
import { LoadingSpinner } from "@/shared/ui/loading/LoadingIndicator";

/** 상수 정의 */
const TOAST_DURATION = 2000; // 토스트 표시 시간 (ms)
const MIN_LOADING_TIME = 800; // 최소 로딩 시간 (ms)

/**
 * 계정 설정 페이지
 * - 가입 정보 조회
 * - 비밀번호 변경 페이지 이동
 * - 로그아웃 기능
 */
export default function AccountSettingsClient() {
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { profile, loading, error: profileError } = useProfile();
  const [minLoading, setMinLoading] = useState(true);

  // 토스트 자동 닫힘
  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(
      () => setToast((prev) => ({ ...prev, show: false })),
      TOAST_DURATION,
    );
    return () => clearTimeout(timer);
  }, [toast.show]);

  // 최소 로딩 시간 보장 (UX 개선)
  useEffect(() => {
    if (loading) {
      setMinLoading(true);
      const timer = setTimeout(() => setMinLoading(false), MIN_LOADING_TIME);
      return () => clearTimeout(timer);
    } else {
      setMinLoading(false);
    }
  }, [loading]);

  /** 로그아웃 확인 핸들러 */
  const handleLogoutConfirm = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logout(); // API 호출
      useAuthStore.getState().logout(); // 클라이언트 상태 정리
      router.push("/mainpage");
    } catch (error) {
      setToast({ show: true, message: "로그아웃에 실패했습니다." });
      setShowLogoutModal(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  /** 뒤로가기 핸들러 */
  const handleBack = () => {
    router.push("./");
  };

  /** 비밀번호 변경 페이지로 이동 */
  const handleChangePassword = () => {
    router.push("/settings/account-settings/change-password");
  };

  // 로딩 중일 때
  if (loading || minLoading) {
    return (
      <LoadingSpinner label="프로필 정보 불러오는 중..." className="h-screen" />
    );
  }

  return (
    <>
      <Header
        title="계정 관리"
        leftChild={
          <button onClick={handleBack} aria-label="뒤로가기">
            <Image
              src="/arrow/left-header-arrow.svg"
              alt="뒤로가기"
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main className="flex h-[calc(100dvh-3rem)] flex-col items-center px-2 py-4">
        {/* 가입 정보 섹션 */}
        <section className="w-full">
          <div className="flex flex-col">
            {/* 가입 정보 표시 */}
            <div className="text-grey-darker flex w-full items-center justify-between px-6 py-3">
              <h2 className="text-xl font-normal">가입 정보</h2>
              {profileError ? (
                <div className="text-red-500">오류가 발생했습니다.</div>
              ) : (
                <div>{profile?.email ?? null}</div>
              )}
            </div>

            {/* 비밀번호 변경 버튼 */}
            <button
              onClick={handleChangePassword}
              className="hover:bg-main-normal-hover active:bg-main-normal-active"
              aria-label="비밀번호 변경 페이지로 이동"
            >
              <div className="flex w-full items-center justify-between px-6 py-3">
                <h3 className="text-grey-darker text-xl font-normal">
                  비밀번호 변경
                </h3>
                <Image
                  src="/arrow/right_arrow_black.svg"
                  alt=""
                  width={12}
                  height={15}
                />
              </div>
            </button>
          </div>
        </section>

        {/* 로그아웃 섹션 */}
        <section className="relative my-5">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-primary-normal hover:bg-primary-normal-hover active:bg-primary-normal-active h-[50px] w-[335px] rounded-md text-[17px] font-medium text-white"
            aria-label="로그아웃"
          >
            로그아웃
          </button>
          {toast.show && (
            <Toast
              message={toast.message}
              show={toast.show}
              className="-bottom-28"
            />
          )}
        </section>

        {/* 로그아웃 확인 모달 */}
        {showLogoutModal && (
          <ModalWrapper>
            <AlertModal
              title="로그아웃 하시겠어요?"
              description="확인을 누르면 로그아웃됩니다."
              confirmText="아니요"
              cancelText="네"
              onClose={handleLogoutConfirm}
              onConfirm={() => setShowLogoutModal(false)}
              swapButtonOrder={true}
            />
          </ModalWrapper>
        )}
      </main>
    </>
  );
}
