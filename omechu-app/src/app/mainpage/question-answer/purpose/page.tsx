"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import ProgressBar from "@/app/components/common/ProgressBar";
import BottomNav from "@/app/components/mainpage/BottomNav";

export default function PurposePage() {
  const [selected, setSelected] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const purposes = ["든든한 한 끼 식사", "술 겸 안주", "간식", "기념일 식사"];

  return (
    <div className="flex h-screen w-auto flex-col">
      <div className="px-4 pt-5">
        <ProgressBar
          currentStep={2}
          totalSteps={5}
          onCancelClick={() => {
            setShowModal(true);
          }}
        />
      </div>
      <main className="flex h-full w-full flex-1 flex-col items-center justify-center gap-12">
        <h2 className="text-center text-2xl">식사 목적은 무엇인가요?</h2>

        <div className="flex w-60 flex-col gap-5">
          {purposes.map((purpose) => (
            <button
              key={purpose}
              onClick={() => {
                setSelected(purpose);
                router.push("./state");
              }}
              className={`h-12 w-full rounded-md border-[1px] p-2 text-lg ${
                selected === purpose
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-red-500 bg-white text-red-500"
              }`}
            >
              {purpose}
            </button>
          ))}
        </div>
      </main>
      <BottomNav prevPath="./meal-time" nextPath="./state" />
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
