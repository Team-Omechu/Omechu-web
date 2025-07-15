"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import ProgressBar from "@/app/components/common/ProgressBar";

export default function SetupState() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative flex h-screen w-auto flex-col">
      <ProgressBar
        currentStep={2}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
      />
      <main className="flex min-h-[calc(100vh-9rem)] w-full flex-col items-center px-4 py-6">
        <section className="my-20">
          <div className="whitespace-pre px-10 text-center text-3xl font-medium leading-relaxed">
            지금 어떤 운동 상태에{"\n"}
            가까운가요?
          </div>
        </section>
        <section className="-mt-4 flex flex-col items-center justify-center">
          <div className="z-10 flex flex-col gap-5">
            {["다이어트 중", "증량 중", "유지 중"].map((item, index) => (
              <button
                key={index}
                className="h-12 w-60 rounded-md border-[1px] border-[#FB4746] bg-white p-2 text-xl text-[#FB4746] hover:bg-[#e2403f] hover:text-white active:bg-[#c93938]"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      </main>
      <footer className="flex w-full flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-between">
          <button
            onClick={() => {
              router.push("./gender");
            }}
            className="ml-5 text-base text-[#828282] dark:font-semibold dark:text-white"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={() => {
              router.push("./food");
            }}
            className="mr-5 text-base text-[#828282] dark:font-semibold dark:text-white"
          >
            건너뛰기 {">"}
          </button>
        </div>
        <button
          onClick={() => {
            router.push("./food");
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
              router.push("./state"); // 원하는 페이지로 이동
            }}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
