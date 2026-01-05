"use client";

import { useState } from "react";

import { ProgressBar } from "@/shared_FSD/ui/ProgressBar";

export default function ProgressBarTestPage() {
  const [step, setStep] = useState(1);
  const total = 5;

  return (
    <main className="flex flex-col justify-center space-y-6">
      <h1 className="text-body-4-regular">ProgressBar Test</h1>

      <ProgressBar currentStep={step} totalSteps={5} />
      <ProgressBar currentStep={step} totalSteps={3} />

      <div className="flex gap-3">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className="rounded-[10px] border px-4 py-2"
        >
          Prev
        </button>
        <button
          onClick={() => setStep((s) => Math.min(total, s + 1))}
          className="rounded-[10px] border px-4 py-2"
        >
          Next
        </button>
      </div>

      <p className="text-caption-1-medium">
        currentStep: {step} / {total}
      </p>
    </main>
  );
}
