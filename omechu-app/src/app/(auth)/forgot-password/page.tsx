"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Toast from "@/components/common/Toast";
import type { FindPasswordFormValues } from "@/auth/schemas/auth.schema";
import { useRequestPasswordResetMutation } from "@/lib/hooks/useAuth";
import { ApiClientError } from "@/lib/api/auth";

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
      const e = error as ApiClientError & { code?: string; status?: number };
      const code = e?.code;
      let msg: string =
        e?.message || "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
      switch (code) {
        case "E002": // UserNotFoundError
          msg = "해당 이메일의 사용자를 찾을 수 없습니다.";
          break;
      }
      if (!code && e?.status === 404) {
        // 라우팅/엔드포인트 404 등도 사용자 친화적으로 처리
        msg = "요청 경로를 찾을 수 없어요. 잠시 후 다시 시도해 주세요.";
      }
      triggerToast(msg);
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
