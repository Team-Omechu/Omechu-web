"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import ProgressBar from "@/app/components/common/ProgressBar";
import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";

export default function SetupGender() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col w-auto h-screen">
      <ProgressBar
        currentStep={1}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
      />
      <main className="flex flex-col items-center w-full px-4 py-6 min-h-[calc(100vh-9rem)]">
        <section className="my-20">
          <div className="text-3xl font-medium">성별은 무엇인가요?</div>
        </section>
        <section className="my-10">
          <div className="flex gap-5">
            <button className="w-28 h-14 p-2.5 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              여성
            </button>
            <button className="w-28 h-14 p-2.5 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              남성
            </button>
          </div>
        </section>
      </main>
      <footer className="flex flex-col items-end w-full pb-[env(safe-area-inset-bottom)] gap-3">
        <button
          onClick={() => {
            router.push("./state");
          }}
          className="mr-5 text-base text-[#828282] dark:text-white dark:font-semibold"
        >
          건너뛰기 {">"}
        </button>
        <button
          onClick={() => {
            router.push("./state");
          }}
          className="p-2 min-w-full h-12  rounded-t-md 
                    text-white text-xl font-normal
                    bg-[#1F9BDA] dark:bg-[#1774a4]
                    hover:bg-[#1c8cc4] dark:hover:bg-[#135d83]
                    active:bg-[#197cae] dark:active:bg-[#0e4662]"
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
