"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/app/components/common/ProgressBar";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import AlertModal from "@/app/components/common/AlertModal";
import BottomNav from "@/app/components/mainpage/BottomNav";

export default function BudgetPage() {
  const [selected, setSelected] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const budgets = ["1만원 미만", "1만원~3만원", "3만원 초과"];

  return (
    <div className="flex flex-col w-auto h-screen">
      <div className="px-4 pt-5">
        <ProgressBar
          currentStep={5}
          totalSteps={5}
          onCancelClick={() => {
            setShowModal(true);
          }}
        />
      </div>
      <main className="flex flex-col items-center justify-center flex-1 w-full h-full gap-12">
        <h2 className="text-2xl text-center">예산은 어떻게 되시나요?</h2>

        <div className="flex flex-col w-60 gap-4">
          {budgets.map((budget) => (
            <button
              key={budget}
              onClick={() => {
                setSelected(budget);
                router.push("./middle-question");
              }}
              className={`w-full h-12 rounded-md border-[1px] text-lg
              ${
                selected === budget
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-red-500 border-red-500"
              }`}
            >
              {budget}
            </button>
          ))}
        </div>
      </main>
      <BottomNav prevPath="./who" showNext={false} />
      {showModal && (
        <ModalWrapper>
          <AlertModal
            title="메뉴 추천을 중단하시겠어요?"
            onConfirm={() => {
              router.push("/");
              setShowModal(false);
            }}
            onClose={() => {
              setShowModal(false);
            }}
            confirmText="확인"
          />
        </ModalWrapper>
      )}
    </div>
  );
}
