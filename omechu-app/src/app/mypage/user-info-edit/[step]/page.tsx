// src/app/mypage/user-info-edit/[step]/page.tsx
import { notFound } from "next/navigation";
import { stepComponents } from "@/app/constant/UserInfoEditSteps";

type StepKey = keyof typeof stepComponents;

export default function StepPage({ params }: { params: { step: string } }) {
  const step = params.step as StepKey;
  const Component = stepComponents[step];

  if (!Component) return notFound();

  return <Component />;
}
