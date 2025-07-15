"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import ProgressBar from "@/app/components/common/ProgressBar";

export default function SetupCondition() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex h-screen w-auto flex-col">
      <ProgressBar
        currentStep={4}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
      />
      <main className="relative flex min-h-[calc(100vh-9rem)] w-full flex-col items-center px-4 py-6">
        <section className="my-20">
          <div className="whitespace-pre px-10 text-center text-3xl font-medium leading-relaxed">
            체질은 무엇인가요?
          </div>
        </section>
        <section className="mt-10 w-full px-8">
          <div className="flex flex-col gap-5">
            {[
              "감기에 잘 걸리는 편이에요",
              "소화가 잘 안되는 날이 많아요",
              "열이 많아서 더위를 잘 타요",
              "추위를 잘 타고 몸이 쉽게 차가워져요",
            ].map((item, index) => (
              <button
                key={index}
                className="h-12 w-full rounded-md border-[1px] border-[#FB4746] bg-white p-2 text-lg text-[#FB4746] hover:bg-[#e2403f] hover:text-white active:bg-[#c93938] dark:hover:bg-[#972b2a] dark:active:bg-[#71201f]"
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
              router.push("./food");
            }}
            className="ml-5 text-base text-[#828282] dark:font-semibold dark:text-white"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={() => {
              router.push("./allergy");
            }}
            className="mr-5 text-base text-[#828282] dark:font-semibold dark:text-white"
          >
            건너뛰기 {">"}
          </button>
        </div>
        <button
          onClick={() => {
            router.push("./allergy");
          }}
          className="h-12 min-w-full rounded-t-md bg-[#1f9bda] p-2 text-xl font-normal text-white hover:bg-[#1c8cc4] active:bg-[#197cae]"
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
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
