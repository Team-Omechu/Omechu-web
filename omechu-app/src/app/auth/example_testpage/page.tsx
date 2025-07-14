"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import LoginPromptModal from "@/app/auth/components/LoginPromptModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";

export default function ExampleTestPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();

  const handleConfirm = () => {
    setIsModalOpen(false);
    // 실제라면 로그인 페이지로 이동하겠지만, 여기서는 모달만 닫습니다.
    alert("'로그인 하기' 클릭됨");
    router.push("/auth/login"); // 예시: 로그인 페이지로 이동
  };

  const handleClose = () => {
    setIsModalOpen(false);
    alert("'그냥 추천받기' 또는 'X' 클릭됨");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-2xl">LoginPromptModal 테스트 페이지</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isModalOpen}
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
      >
        모달 다시 열기
      </button>

      {isModalOpen && (
        <ModalWrapper>
          <LoginPromptModal onConfirm={handleConfirm} onClose={handleClose} />
        </ModalWrapper>
      )}
    </div>
  );
} 