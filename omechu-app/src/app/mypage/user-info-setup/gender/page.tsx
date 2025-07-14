"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import ProgressBar from "@/app/components/common/ProgressBar";

export default function SetupGender() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex h-screen w-auto flex-col">
      <ProgressBar
        currentStep={1}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
      />
      <main className="flex min-h-[calc(100vh-9rem)] w-full flex-col items-center px-4 py-6">
        <section className="my-20">
          <div className="text-3xl font-medium">성별은 무엇인가요?</div>
        </section>
        <section className="my-10">
          <div className="flex gap-5">
            <button className="h-14 w-28 rounded-md border-[1px] border-[#FB4746] bg-white p-2.5 text-xl text-[#FB4746] hover:bg-[#e2403f] hover:text-white active:bg-[#c93938]">
              여성
            </button>
            <button className="h-14 w-28 rounded-md border-[1px] border-[#FB4746] bg-white p-2.5 text-xl text-[#FB4746] hover:bg-[#e2403f] hover:text-white active:bg-[#c93938]">
              남성
            </button>
          </div>
        </section>
      </main>
      <footer className="flex w-full flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={() => {
            router.push("./state");
          }}
          className="mr-5 text-base text-[#828282] dark:font-semibold dark:text-white"
        >
          건너뛰기 {">"}
        </button>
        <button
          onClick={() => {
            router.push("./state");
          }}
          className="h-12 min-w-full rounded-t-md bg-[#1F9BDA] p-2 text-xl font-normal text-white hover:bg-[#1c8cc4] active:bg-[#197cae] dark:bg-[#1774a4] dark:hover:bg-[#135d83] dark:active:bg-[#0e4662]"
        >
          다음
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
              setShowModal(false);
              router.push("./"); // 원하는 페이지로 이동
            }}
            onClose={() => {
              setShowModal(false);
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
