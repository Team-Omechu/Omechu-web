"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/app/components/common/ProgressBar";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import AlertModal from "@/app/components/common/AlertModal";
import BottomNav from "@/app/components/mainpage/BottomNav";

export default function WhoPage() {
  const [selected, setSelected] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const whos = ["혼자", "연인", "친구들", "가족들"];

  return (
    <div className="flex flex-col w-auto h-screen">
      <div className="px-4 pt-5">
        <ProgressBar
          currentStep={4}
          totalSteps={5}
          onCancelClick={() => {
            setShowModal(true);
          }}
        />
      </div>
      <main className="flex flex-col items-center justify-center flex-1 w-full h-full gap-12">
        <div>
          <h2 className="text-2xl text-center">혼자 식사하시나요</h2>
          <h2 className="text-2xl text-center">누구와 함께 하시나요?</h2>
        </div>

        <div className="flex flex-col w-60 gap-4">
          {whos.map((who) => (
            <button
              key={who}
              onClick={() => {
                setSelected(who);
                router.push("./budget");
              }}
              className={`w-full h-12 p-2 rounded-md border-[1px] text-lg
              ${
                selected === who
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-red-500 border-red-500"
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
