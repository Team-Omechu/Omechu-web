"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import type { ResetPasswordFormValues } from "@/lib/schemas/auth.schema";

import ResetPasswordForm from "./components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (data: ResetPasswordFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push("/auth/sign-in");
  };

  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-sm flex-col items-center gap-8">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-xl font-medium text-[#393939]">
              비밀번호 재설정
            </h1>
            <p className="text-sm font-normal text-[#828282]">
              사용하실 새로운 비밀번호를 설정해 주세요
            </p>
          </div>

          <ResetPasswordForm onFormSubmit={handleFormSubmit} />
        </div>
      </main>

      {isModalOpen && (
        <ModalWrapper>
          <AlertModal
            title="비밀번호를 재설정했어요"
            description="새로운 비밀번호로 로그인하세요"
            confirmText="확인"
            onConfirm={handleModalConfirm}
          />
        </ModalWrapper>
      )}
    </>
  );
}
