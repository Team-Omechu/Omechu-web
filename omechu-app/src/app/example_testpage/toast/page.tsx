"use client";

import { useState } from "react";

import Toast from "@/shared_FSD/ui/toast/Toast";

export default function ToastTestPage() {
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <main className="space-y-4 p-6">
      <h1 className="text-lg font-semibold">Toast 컴포넌트 테스트</h1>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
          }}
          className="rounded bg-white px-3 py-1"
        >
          Error
        </button>

        <button
          onClick={() => {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
          }}
          className="rounded bg-white px-3 py-1"
        >
          Success
        </button>
      </div>

      {/* 토스트 렌더 */}
      <Toast
        message={`이메일 또는 비밀번호가 올바르지 않습니다. \n 입력한 내용을 다시 확인해 주세요.`}
        state="error"
        show={showError}
      />
      <Toast
        message="문의가 접수되었어요."
        state="success"
        show={showSuccess}
      />
    </main>
  );
}
