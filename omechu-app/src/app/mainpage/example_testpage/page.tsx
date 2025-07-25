"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import LoginPromptModal from "@/mainpage/example_testpage/components/LoginPromptModal";
import LoginPromptModal2 from "@/mainpage/example_testpage/components/LoginPromptModal2";
import ModalWrapper from "@/components/common/ModalWrapper";

type ModalType = "modal1" | "modal2" | null;

export default function ExampleTestPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const router = useRouter();

  const handleConfirm = () => {
    setActiveModal(null);
    alert("'로그인 하기' 클릭됨");
    router.push("/auth/sign-in");
  };

  const handleClose = () => {
    setActiveModal(null);
    alert("모달 닫힘");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="mb-4 text-2xl">LoginPromptModal 테스트 페이지</h1>
      <div className="flex gap-4">
        <button
          onClick={() => setActiveModal("modal1")}
          disabled={!!activeModal}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          모달 1 열기
        </button>
        <button
          onClick={() => setActiveModal("modal2")}
          disabled={!!activeModal}
          className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-400"
        >
          모달 2 열기
        </button>
      </div>

      {activeModal && (
        <ModalWrapper>
          {activeModal === "modal1" && (
            <LoginPromptModal onConfirm={handleConfirm} onClose={handleClose} />
          )}
          {activeModal === "modal2" && (
            <LoginPromptModal2
              onConfirm={handleConfirm}
              onClose={handleClose}
            />
          )}
        </ModalWrapper>
      )}
    </div>
  );
}
