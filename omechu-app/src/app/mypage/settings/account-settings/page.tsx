"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useProfile } from "../../hooks/useProfile";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";

const userEmail: string = "dlapdlf@gmail.com";

export default function AccountSettings() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState(""); // 기본값 설정

  const userId = 1; // 실제는 store/context에서
  const { profile, loading, error: profileError } = useProfile(userId);

  // 상태와 동기화 (처음 한 번만)
  useEffect(() => {
    if (profile) {
      setEmail(profile.email ?? "");
    }
  }, [profile]);

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
            <div className="flex items-center justify-between w-full px-6 py-3 text-grey-darker">
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
              <div className="flex items-center justify-between w-full px-6 py-3">
                <h1 className="text-xl font-normal text-grey-darker">
                  비밀번호 변경
                </h1>
                <div>
                  <Image
                    src={"/right_arrow_black.png"}
                    alt={"오른쪽 이동 버튼"}
                    width={12}
                    height={15}
                  />
                </div>
              </div>
            </button>
          </div>
        </section>
        <section className="mt-5">
          <button
            onClick={() => setShowModal(true)}
            className="h-[50px] w-[335px] rounded-md bg-primary-normal text-[17px] font-medium text-white hover:bg-primary-normalHover active:bg-primary-normalActive"
          >
            로그아웃
          </button>
        </section>
        {showModal && (
          <ModalWrapper>
            <AlertModal
              title="로그아웃 하시겠어요?"
              confirmText="아니요"
              cancelText="네"
              onConfirm={() => setShowModal(false)}
              onClose={() => router.push("/mypage")}
              swapButtonOrder={true}
            />
          </ModalWrapper>
        )}
      </main>
    </>
  );
}
