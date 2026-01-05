"use client";

import { useState } from "react";

import { OnboardingModal } from "@/shared_FSD/ui/modal/OnboardingModal";

export default function OnboardingModalTestPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <main className="bg-font-high flex min-h-screen items-center justify-center">
      <OnboardingModal
        title="저장 완료!"
        subtitle="이제 맛있는 메뉴 추천을 받아볼까요?"
        onInfoClick={() => toggleSelect("info")}
        onRecommendClick={() => toggleSelect("recommend")}
        onClose={() => toggleSelect("close")}
      />

      {selected.length > 0 && (
        <div className="absolute top-6">
          <p className="text-caption-1-medium text-center whitespace-pre-wrap">
            선택된 액션: {selected.join(", ")}
          </p>
        </div>
      )}
    </main>
  );
}
