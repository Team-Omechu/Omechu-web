"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/app/components/common/Header";
import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";

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
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main className="flex flex-col items-center px-2 py-2">
        <section className="w-full">
          <div className="flex flex-col">
            <div className="flex items-center justify-between w-full px-6 py-3 text-[#393939]">
              <h1 className="text-base font-normal">가입 정보</h1>
              <div>{userEmail}</div>
            </div>
            <button
              onClick={() =>
                router.push("/mypage/settings/account-settings/change-password")
              }
              className="hover:bg-[#dfc0e6] active:bg-[#c6aacc]"
            >
              <div className="flex items-center justify-between w-full px-6 py-3">
                <h1 className="text-base font-normal text-[#393939]">
                  비밀번호 변경
                </h1>
                <div>
                  <Image
                    src={"/right_arrow_black.png"}
                    alt={"오른쪽 이동 버튼"}
                    width={9}
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
            className="w-[335px] h-[45px] text-white text-[17px] font-medium
                    bg-[#fb4746] hover:bg-[#e2403f] active:bg-[#c93938] rounded-md "
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
