/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useProfile } from "../../hooks/useProfile";
import { logout } from "@/lib/api/auth";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";
import Toast from "@/components/common/Toast";
import { useAuthStore } from "@/lib/stores/auth.store";
import { LoadingSpinner } from "@/components/common/LoadingIndicator";

export default function AccountSettingsClient() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { profile, loading, error: profileError } = useProfile();
  const [minLoading, setMinLoading] = useState(true);

  // 토스트 자동 닫힘
  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(
      () => setToast((prev) => ({ ...prev, show: false })),
      2000,
    );
    return () => clearTimeout(t);
  }, [toast.show]);

  // 최소 로딩 시간 보장
  useEffect(() => {
    if (loading) {
      setMinLoading(true);
      const t = setTimeout(() => setMinLoading(false), 800);
      return () => clearTimeout(t);
    } else {
      setMinLoading(false);
    }
  }, [loading]);

  // 최종 로딩 스피너
  if (loading || minLoading) {
    return (
      <LoadingSpinner label="프로필 정보 불러오는 중..." className="h-screen" />
    );
  }

  const handleLogoutConfirm = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout(); // API 호출
      useAuthStore.getState().logout(); // 클라이언트 상태 정리
      router.push("/mainpage");
    } catch (e) {
      setToast({ show: true, message: "로그아웃에 실패했습니다." });
      setShowModal(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Header
        title={"계정 관리"}
        leftChild={
          <button onClick={() => router.push("./")}>
            <img
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main className="flex h-[calc(100dvh-3rem)] flex-col items-center px-2 py-4">
        <section className="w-full">
          <div className="flex flex-col">
            <div className="flex w-full items-center justify-between px-6 py-3 text-grey-darker">
              <h1 className="text-xl font-normal">가입 정보</h1>
              {profileError ? (
                <div className="text-red-500">오류가 발생했습니다.</div>
              ) : (
                <div>{profile?.email ?? null}</div>
              )}
            </div>

            <button
              onClick={() =>
                router.push("/mypage/settings/account-settings/change-password")
              }
              className="hover:bg-main-normal-hover active:bg-main-normal-hover"
            >
              <div className="flex w-full items-center justify-between px-6 py-3">
                <h1 className="text-xl font-normal text-grey-darker">
                  비밀번호 변경
                </h1>
                <div>
                  <img
                    src={"/arrow/right_arrow_black.svg"}
                    alt={"오른쪽 이동 버튼"}
                    width={12}
                    height={15}
                  />
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="relative my-5">
          <button
            onClick={() => setShowModal(true)}
            className="h-[50px] w-[335px] rounded-md bg-primary-normal text-[17px] font-medium text-white hover:bg-primary-normal-hover active:bg-primary-normal-active"
          >
            로그아웃
          </button>
          {toast && (
            <Toast
              message={toast.message}
              show={toast.show}
              className="-bottom-28"
            />
          )}
        </section>

        {showModal && (
          <ModalWrapper>
            <AlertModal
              title="로그아웃 하시겠어요?"
              description="확인을 누르면 로그아웃됩니다."
              confirmText="아니요"
              cancelText="네"
              onClose={handleLogoutConfirm}
              onConfirm={() => setShowModal(false)}
              swapButtonOrder={true}
            />
          </ModalWrapper>
        )}
      </main>
    </>
  );
}
