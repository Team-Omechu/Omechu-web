"use client";
import { useState } from "react";

import { OnboardingButton } from "@/shared_FSD/ui/button/OnboardingButton";

export default function OnboardingButtonTestPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <main className="relative flex flex-col items-center gap-6 p-6">
      <h1 className="text-body-2-bold">OnboardingButton Test</h1>
      <section className="flex flex-col gap-3">
        <OnboardingButton
          width="xl"
          selected={selected.includes("diet")}
          onClick={() => toggleSelect("diet")}
        >
          다이어트 중
        </OnboardingButton>

        <OnboardingButton
          width="xl"
          selected={selected.includes("bulk")}
          onClick={() => toggleSelect("bulk")}
        >
          증량 중
        </OnboardingButton>

        <OnboardingButton
          width="xl"
          selected={selected.includes("maintain")}
          onClick={() => toggleSelect("maintain")}
        >
          유지 중
        </OnboardingButton>
      </section>

      <section className="flex flex-col gap-3">
        <OnboardingButton
          width="md"
          selected={selected.includes("breakfast")}
          onClick={() => toggleSelect("breakfast")}
        >
          아침
        </OnboardingButton>

        <OnboardingButton
          width="md"
          selected={selected.includes("lunch")}
          onClick={() => toggleSelect("lunch")}
        >
          점심
        </OnboardingButton>

        <OnboardingButton
          width="md"
          selected={selected.includes("dinner")}
          onClick={() => toggleSelect("dinner")}
        >
          저녁
        </OnboardingButton>

        <OnboardingButton
          width="md"
          selected={selected.includes("late-night-snack")}
          onClick={() => toggleSelect("late-night-snack")}
        >
          야식
        </OnboardingButton>
      </section>

      <div className="flex flex-col gap-2.5">
        <section className="grid grid-cols-3 gap-2.5">
          {["달걀", "우유", "메밀", "대두", "밀", "땅콩"].map((item) => {
            const id = `allergy-${item}`;
            return (
              <OnboardingButton
                key={id}
                width="xs"
                selected={selected.includes(id)}
                onClick={() => toggleSelect(id)}
              >
                {item}
              </OnboardingButton>
            );
          })}
        </section>

        <section className="grid grid-cols-2 gap-2.5">
          <OnboardingButton
            width="sm"
            selected={selected.includes("sulfur")}
            onClick={() => toggleSelect("sulfur")}
          >
            아황산류
          </OnboardingButton>

          <OnboardingButton
            width="sm"
            selected={selected.includes("other")}
            onClick={() => toggleSelect("other")}
          >
            그 외
          </OnboardingButton>
        </section>
      </div>
      {selected.length > 0 && (
        <p className="text-center whitespace-pre-wrap">
          선택됨: {selected.join(", ")}
        </p>
      )}
    </main>
  );
}
