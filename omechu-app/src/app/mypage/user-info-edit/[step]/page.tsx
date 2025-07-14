// src/app/mypage/user-info-edit/[step]/page.tsx

export const dynamicParams = true;
export const dynamic = "auto";

export function generateStaticParams() {
  return [
    { step: "start" },
    { step: "gender" },
    { step: "state" },
    { step: "food" },
    { step: "condition" },
    { step: "allergy" },
  ];
}

import { notFound } from "next/navigation";
import { stepComponents } from "@/app/constant/UserInfoEditSteps";

export default function StepPage({ params }: { params: { step: string } }) {
  const Component = stepComponents[params.step as keyof typeof stepComponents];

  if (!Component) return notFound();

  return <Component />;
}
