"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { indexToSlug } from "@/app/mypage/user-info-edit-test/[step]/page";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import ProgressBar from "@/app/components/common/ProgressBar";

export default function ConditionStep() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const constitution = useOnboardingStore((state) => state.constitution);
  const toggleConstitution = useOnboardingStore(
    (state) => state.toggleConstitution
  );

  const handleClick = (item: string) => {
    toggleConstitution(item);
  };

  return (
    <div className="flex flex-col w-auto h-screen">
      <ProgressBar
        currentStep={4}
        totalSteps={5}
        onCancelClick={() => setShowModal(true)}
        cancelButtonText="그만하기"
      />

      <main className="relative flex flex-col items-center w-full px-4 py-6 min-h-[calc(100vh-9rem)]">
        <section className="my-20">
          <div className="px-10 text-3xl font-medium leading-relaxed text-center whitespace-pre">
            체질은 무엇인가요?
          </div>
        </section>

        <section className="w-full px-5 mt-10">
          <div className="flex flex-col gap-5">
            {[
              "감기에 잘 걸리는 편이에요",
              "소화가 잘 안되는 날이 많아요",
              "열이 많아서 더위를 잘 타요",
              "추위를 잘 타고 몸이 쉽게 차가워져요",
            ].map((item) => {
              const isSelected = constitution.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`w-full h-12 px-2 py-1 text-lg rounded-md border-[1px]
                    ${
                      isSelected
                        ? "bg-[#FB4746] text-white border-[#FB4746]"
                        : "bg-white text-[#FB4746] border-[#FB4746] hover:bg-[#e2403f] hover:text-white"
                    }
                  `}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="flex flex-col w-full pb-[env(safe-area-inset-bottom)] gap-3">
        <div className="flex justify-between">
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit-test/${indexToSlug[3]}
`)
            }
            className="ml-5 text-base text-[#828282] dark:text-white dark:font-semibold"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit-test/${indexToSlug[5]}
`)
            }
            className="mr-5 text-base text-[#828282] dark:text-white dark:font-semibold"
          >
            건너뛰기 {">"}
          </button>
        </div>
        <button
          onClick={() =>
            router.push(`/mypage/user-info-edit-test/${indexToSlug[5]}
`)
          }
          className="px-2 pt-1 min-w-full h-12 text-white text-xl font-normal rounded-t-md bg-[#1f9bda] hover:bg-[#1c8cc4] active:bg-[#197cae]"
        >
          저장
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
              router.push(`/mypage/user-info-edit-test`);
            }}
            onClose={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
