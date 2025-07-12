"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/app/components/common/ProgressBar";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import AlertModal from "@/app/components/common/AlertModal";
import BottomNav from "@/app/components/mainpage/BottomNav";

export default function StatePage() {
  const [selected, setSelected] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const states = [
    "들뜨고 신나요",
    "지치고 피곤해요",
    "슬프고 울적해요",
    "화나고 답답해요",
  ];

  return (
    <div className="flex flex-col w-auto h-screen">
      <div className="px-4 pt-5">
        <ProgressBar
          currentStep={3}
          totalSteps={5}
          onCancelClick={() => {
            setShowModal(true);
          }}
        />
      </div>
      <main className="flex flex-col items-center justify-center flex-1 w-full h-full gap-12">
        <h2 className="text-2xl text-center">기분 상태는 어떤가요?</h2>

        <div className="flex flex-col w-60 gap-4">
          {states.map((state) => (
            <button
              key={state}
              onClick={() => {
                setSelected(state);
                router.push("./who");
              }}
              className={`w-full h-12 rounded-md border-[1px] text-lg
              ${
                selected === state
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-red-500 border-red-500"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </main>
      <BottomNav prevPath="./purpose" nextPath="./who" />
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
