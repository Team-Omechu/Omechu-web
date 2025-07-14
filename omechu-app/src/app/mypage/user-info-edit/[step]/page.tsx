"use client";

// ✅ generateStaticParams 제거
// ✅ dynamicParams 명시
export const dynamicParams = true;

import { notFound } from "next/navigation";
import { stepComponents } from "@/app/constant/UserInfoEditSteps";

export default function StepPage({ params }: { params: { step: string } }) {
  const Component = stepComponents[params.step as keyof typeof stepComponents];

  if (!Component) return notFound();

  return <Component />;
}
