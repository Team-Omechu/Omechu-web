"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import type { ResetPasswordFormValues } from "@/auth/schemas/auth.schema";
import { useResetPasswordMutation } from "@/lib/hooks/useAuth";
import Toast from "@/components/common/Toast";

import ResetPasswordForm from "./components/ResetPasswordForm";
import Header from "@/components/common/Header";
import { ApiClientError } from "@/lib/api/auth";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm text-grey-normal">로딩 중...</div>}
    >
      <ResetPasswordClient />
    </Suspense>
  );
}

function ResetPasswordClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { mutateAsync: resetPassword } = useResetPasswordMutation();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleFormSubmit = async (data: ResetPasswordFormValues) => {
    try {
      if (!token) {
        triggerToast(
          "유효하지 않은 링크입니다. 이메일의 링크를 다시 확인해 주세요.",
        );
        return;
      }
      await resetPassword({ ...data, token });
      setIsModalOpen(true);
    } catch (error: any) {
      const e = error as ApiClientError & { code?: string };
      const code = e?.code;
      let msg: string = e?.message || "비밀번호 재설정에 실패했습니다.";
      switch (code) {
        case "E001": // InvalidOrExpiredTokenError
        case "V002": // VerificationCodeExpiredError
          msg = "링크가 만료되었어요. 이메일에서 새 링크로 다시 시도해 주세요.";
          break;
        case "E002": // UserNotFoundError
          msg = "사용자를 찾을 수 없습니다. 다시 시도해 주세요.";
          break;
        case "V003": // InvalidPasswordError
          msg = "비밀번호 형식이 올바르지 않습니다.";
          break;
      }
      triggerToast(msg);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push("/sign-in");
  };

  return (
    <>
      <main className="flex h-[calc(100dvh-3rem)] flex-col items-center px-4 py-2">
        <Toast
          message={toastMessage}
          show={showToast}
          className="fixed bottom-24 left-1/2 z-[9999] -translate-x-1/2"
        />
        <section className="flex w-full flex-col gap-4 px-3 pt-16">
          <div className="mb-8 flex flex-col gap-3 text-center">
            <h1 className="text-xl font-medium text-grey-darker">
              비밀번호 재설정
            </h1>
            <p className="text-sm font-normal text-grey-normalActive">
              사용하실 새로운 비밀번호를 설정해 주세요
            </p>
          </div>
          <ResetPasswordForm onFormSubmit={handleFormSubmit} />
        </section>
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
