"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ApiClientError } from "@/entities/user/api/authApi";
import { useRequestPasswordResetMutation } from "@/entities/user/lib/hooks/useAuth";
import type { FindPasswordFormValues } from "@/entities/user/model/auth.schema";
import { Header, Toast } from "@/shared";
import { ForgotPasswordForm } from "@/widgets/auth";

export default function ForgotPasswordPage() {
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
      const e = error as ApiClientError & { code?: string; status?: number };
      const msg: string =
        e?.message || "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
      triggerToast(msg);
    }
  };

  return (
    <main className="flex flex-1 flex-col bg-background-primary">
      <Header onLeftClick={() => router.back()} />

      <div className="flex flex-col px-5">
        {/* 타이틀 영역 */}
        <div className="flex flex-col items-center gap-3 py-5">
          <h1 className="text-body-2-bold text-font-high text-center">
            비밀번호 찾기
          </h1>
          <p className="text-body-4-regular text-font-low text-center">
            가입하신 이메일 주소를 입력하여
            <br />
            비밀번호를 재설정하실 수 있어요
          </p>
        </div>

        {/* 폼 영역 */}
        <div className="pt-8">
          <ForgotPasswordForm onFormSubmit={handleFormSubmit} />
        </div>
      </div>

      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </main>
  );
}
