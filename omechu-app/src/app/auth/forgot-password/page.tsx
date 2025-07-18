"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Toast from "@/app/components/common/Toast";
import type { FindPasswordFormValues } from "@/lib/schemas/auth.schema";

import ForgotPasswordForm from "./components/ForgotPasswordForm";

export default function FindPasswordPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleFormSubmit = async (data: FindPasswordFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.email === "test@naver.com") {
      router.push("/auth/forgot-password/sent");
    } else {
      triggerToast(
        "비밀번호 재설정 메일 발송에 실패했습니다. \n 이메일 주소를 다시 확인해 주세요.",
      );
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-xl font-medium text-[#393939]">비밀번호 찾기</h1>
          <p className="text-sm font-normal text-[#828282]">
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
