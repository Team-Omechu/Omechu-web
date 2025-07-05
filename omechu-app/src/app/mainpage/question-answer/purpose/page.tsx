"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/app/components/common/ProgressBar";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import AlertModal from "@/app/components/common/AlertModal";

export default function PurposePage() {
  const [selected, setSelected] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const purposes = ["든든한 한 끼 식사", "술 겸 안주", "간식", "기념일 식사"];

  return (
    <div className="flex flex-col w-auto h-screen">
      <div className="px-4 pt-5">
        <ProgressBar 
        currentStep={2}
        totalSteps={5}
        onCancelClick={()=>{setShowModal(true)}}
         />
      </div>
      <main className="flex flex-col items-center justify-center flex-1 w-full h-full gap-12">
        <h2 className="text-2xl text-center">식사 목적은 무엇인가요?</h2>

        <div className="flex flex-col w-60 gap-5">
          {purposes.map((purpose) => (
            <button
              key={purpose}
              onClick={() => {setSelected(purpose); router.push("./state")}}
              className={`w-full h-12 p-2 rounded-md border-[1px] text-lg  
              ${
                selected === purpose
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-red-500 border-red-500"
              }`}
            >
              {purpose}
            </button>
          ))}
        </div>
      </main>
      <footer className="flex flex-col w-full pb-10 gap-3">
        <div className="flex justify-between">
          <button
            onClick={() => {
              router.push("./meal-time");
            }}
            className="ml-5 text-base text-[#828282] flex items-center"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={() => {
              router.push("./state");
            }}
            className="mr-5 text-base text-[#828282] flex items-center"
          >
            건너뛰기 {">"}
          </button>
        </div>
      </footer>
      {showModal && (
        <ModalWrapper>
          <AlertModal
            title="메뉴 추천을 중단하시겠어요?"
            onConfirm={() => {router.push("/"); setShowModal(false)}}
            onClose={() => {setShowModal(false)}}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
