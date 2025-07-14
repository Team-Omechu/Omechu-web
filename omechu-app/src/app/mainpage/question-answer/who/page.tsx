"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import ProgressBar from "@/app/components/common/ProgressBar";
import BottomNav from "@/app/components/mainpage/BottomNav";

export default function WhoPage() {
  const [selected, setSelected] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const whos = ["혼자", "연인", "친구들", "가족들"];

  return (
    <div className="flex h-screen w-auto flex-col">
      <div className="px-4 pt-5">
        <ProgressBar
          currentStep={4}
          totalSteps={5}
          onCancelClick={() => {
            setShowModal(true);
          }}
        />
      </div>
      <main className="flex h-full w-full flex-1 flex-col items-center justify-center gap-12">
        <div>
          <h2 className="text-center text-2xl">혼자 식사하시나요</h2>
          <h2 className="text-center text-2xl">누구와 함께 하시나요?</h2>
        </div>

        <div className="flex w-60 flex-col gap-4">
          {whos.map((who) => (
            <button
              key={who}
              onClick={() => {
                setSelected(who);
                router.push("./budget");
              }}
              className={`h-12 w-full rounded-md border-[1px] p-2 text-lg ${
                selected === who
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-red-500 bg-white text-red-500"
              }`}
            >
              {who}
            </button>
          ))}
        </div>
      </main>
      <BottomNav prevPath="./state" nextPath="./budget" />
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
