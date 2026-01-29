"use client";

import { useRouter } from "next/navigation";

import {
  BasicAllergyForm,
  completeOnboarding,
  useOnboardingStore,
} from "@/entities/onboarding";

export default function AllergyForm() {
  const router = useRouter();
  const { nickname, exercise, prefer, allergy } = useOnboardingStore();

  const handleSave = async () => {
    await completeOnboarding({
      nickname,
      exercise: exercise as "다이어트 중" | "증량 중" | "유지 중" | null,
      prefer,
      allergy,
    });
  };

  return (
    <BasicAllergyForm onCancel={() => router.push("/")} onSave={handleSave} />
  );
}
