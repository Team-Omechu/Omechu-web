"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/app/components/common/ProgressBar";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import AlertModal from "@/app/components/common/AlertModal";

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
          onCancelClick={()=>{setShowModal(true)}} />
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
              onClick={() => {setSelected(who); router.push("./budget")}}
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
      <footer className="flex flex-col w-full pb-10 gap-3">
        <div className="flex justify-between">
          <button
            onClick={() => {
              router.push("./state");
            }}
            className="ml-5 text-base text-[#828282] flex items-center"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={() => {
              router.push("./budget");
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
