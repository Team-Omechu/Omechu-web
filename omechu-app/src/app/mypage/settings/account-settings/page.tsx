"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useProfile } from "../../hooks/useProfile";
import { logout } from "@/lib/api/auth";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";
import Toast from "@/components/common/Toast";
import { useAuthStore } from "@/auth/store";
import { LoadingSpinner } from "@/components/common/LoadingIndicator";

export default function AccountSettings() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [email, setEmail] = useState("");

  const user = useAuthStore((state) => state.user);

  const { profile, loading, error: profileError } = useProfile();
  const [minLoading, setMinLoading] = useState(true);

  console.log("[디버깅] user:", user);

  // 동기화
  useEffect(() => {
    if (profile) {
      console.log("[디버깅] profile 응답값:", profile);
      setEmail(profile.email ?? "");
    }
  }, [profile]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        2000,
      );
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setMinLoading(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setMinLoading(false);
    }
  }, [loading]);

  if (loading || minLoading) {
    return (
      <LoadingSpinner label="프로필 정보 불러오는 중..." className="h-screen" />
    );
  }

  return (
    <>
      <Header
        title={"계정 관리"}
        leftChild={
          <button
            onClick={() => {
              router.push("./");
            }}
          >
            <Image
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
              {loading ? (
                <div className="text-grey-darker">불러오는 중...</div>
              ) : profileError ? (
                <div className="text-red-500">오류가 발생했습니다.</div>
              ) : (
                <div>{email}</div>
              )}
            </div>
            <button
              onClick={() =>
                router.push("/mypage/settings/account-settings/change-password")
              }
              className="hover:bg-main-normalHover active:bg-main-normalHover"
            >
              <div className="flex w-full items-center justify-between px-6 py-3">
                <h1 className="text-xl font-normal text-grey-darker">
                  비밀번호 변경
                </h1>
                <div>
                  <Image
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
            className="h-[50px] w-[335px] rounded-md bg-primary-normal text-[17px] font-medium text-white hover:bg-primary-normalHover active:bg-primary-normalActive"
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
              confirmText="아니요"
              cancelText="네"
              onConfirm={() => setShowModal(false)}
              onClose={async () => {
                try {
                  await logout();
                  router.push("/mainpage");
                } catch (e) {
                  setToast({ show: true, message: "로그아웃에 실패했습니다." });
                  setShowModal(false);
                }
                setShowModal(false);
              }}
              swapButtonOrder={true}
            />
          </ModalWrapper>
        )}
      </main>
      {/* {profileError && (
        <ModalWrapper>
          <AlertModal
            title="로그인이 필요합니다"
            description="로그인 후 이용해 주세요."
            confirmText="확인"
            onConfirm={() => {
              router.push("/sign-in");
            }}
          />
        </ModalWrapper>
      )} */}
    </>
  );
}
