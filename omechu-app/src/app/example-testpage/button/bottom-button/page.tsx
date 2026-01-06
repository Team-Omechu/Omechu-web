"use client";

import { BottomButton } from "@/shared_FSD/ui/button/BottomButton";

export default function BottomButtonTestPage() {
  return (
    <div className="relative min-h-screen space-y-12 bg-gray-50 p-6">
      <h1 className="text-body-2-bold">BottomButton Test</h1>

      {/* default */}
      <BottomButton variant="default" onClick={() => alert("default click")}>
        기본 버튼
      </BottomButton>

      {/* disabled */}
      <BottomButton disabled>비활성 버튼</BottomButton>
    </div>
  );
}
