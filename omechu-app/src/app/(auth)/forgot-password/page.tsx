"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Toast from "@/components/common/Toast";
import type { FindPasswordFormValues } from "@/auth/schemas/auth.schema";
import { useRequestPasswordResetMutation } from "@/lib/hooks/useAuth";

import ForgotPasswordForm from "./components/ForgotPasswordForm";

export default function FindPasswordPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();
  const { mutateAsync: requestReset } = useRequestPasswordResetMutation();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleFormSubmit = async (data: FindPasswordFormValues) => {
    try {
      await requestReset(data);
      router.push("/forgot-password/sent");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      triggerToast(`... \n ${message}`);
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-xl font-medium text-grey-darker">
            비밀번호 찾기
          </h1>
          <p className="text-sm font-normal text-grey-normalActive">
            가입하신 이메일 주소를 입력하여
            <br />
            비밀번호를 재설정하실 수 있어요
          </p>
        </div>

        <ForgotPasswordForm onFormSubmit={handleFormSubmit} />
      </div>
      <Toast message={toastMessage} show={showToast} className={"bottom-56"} />
    </main>
  );
}
