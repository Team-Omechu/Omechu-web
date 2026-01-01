"use client";

import { BottomButton } from "@/shared_FSD/ui/button/BottomButton";

export default function BottomButtonTestPage() {
  return (
    <div className="min-h-screen p-6 space-y-6 bg-gray-50">
      <h1 className="text-body-2-bold">BottomButton Test</h1>

      {/* default */}
      <BottomButton variant="default" onClick={() => alert("default click")}>
        기본 버튼
      </BottomButton>

      {/* pressed */}
      <BottomButton variant="pressed" onClick={() => alert("pressed click")}>
        눌린 상태
      </BottomButton>

      {/* disabled */}
      <BottomButton variant="disabled" disabled>
        비활성 버튼
      </BottomButton>
    </div>
  );
}
