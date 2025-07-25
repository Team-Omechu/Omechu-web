"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";

const userEmail: string = "dlapdlf@gmail.com";

export default function AccountSettings() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
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
            <div className="flex w-full items-center justify-between px-6 py-3 text-[#393939]">
              <h1 className="text-xl font-normal">가입 정보</h1>
              <div>{userEmail}</div>
            </div>
            <button
              onClick={() =>
                router.push("/mypage/settings/account-settings/change-password")
              }
              className="hover:bg-main-normalHover active:bg-main-normalActive"
            >
              <div className="flex w-full items-center justify-between px-6 py-3">
                <h1 className="text-xl font-normal text-[#393939]">
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
            className="bg-primary-normal hover:bg-primary-normalHover active:bg-primary-normalActive h-[50px] w-[335px] rounded-md text-[17px] font-medium text-white"
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
