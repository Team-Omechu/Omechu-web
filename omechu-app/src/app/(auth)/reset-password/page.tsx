"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BaseModal, ModalWrapper, Toast, Header } from "@/shared";
import type { ResetPasswordFormValues } from "@/entities/user/model/auth.schema";
import { useResetPasswordMutation } from "@/entities/user/lib/hooks/useAuth";
import { ApiClientError } from "@/entities/user/api/authApi";

import { ResetPasswordForm } from "@/widgets/auth";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<div className="text-grey-normal p-6 text-sm">로딩 중...</div>}
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
    if (!token) {
      // 폼에서 일관되게 처리하도록 에러를 던진다
      throw new ApiClientError(
        "유효하지 않은 링크입니다. 이메일의 링크를 다시 확인해 주세요.",
        "E001",
      );
    }
    await resetPassword({ ...data, token });
    setIsModalOpen(true);
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
          className="fixed bottom-24 left-1/2 z-9999 -translate-x-1/2"
        />
        <section className="flex w-full flex-col gap-4 px-3 pt-16">
          <div className="mb-8 flex flex-col gap-3 text-center">
            <h1 className="text-grey-darker text-xl font-medium">
              비밀번호 재설정
            </h1>
            <p className="text-grey-normal-active text-sm font-normal">
              사용하실 새로운 비밀번호를 설정해 주세요
            </p>
          </div>
          <ResetPasswordForm onFormSubmit={handleFormSubmit} />
        </section>
      </main>

      {isModalOpen && (
        <ModalWrapper>
          <BaseModal
            title="비밀번호를 재설정했어요"
            desc="새로운 비밀번호로 로그인하세요"
            rightButtonText="확인"
            isCloseButtonShow={false}
            onRightButtonClick={handleModalConfirm}
          />
        </ModalWrapper>
      )}
    </>
  );
}
