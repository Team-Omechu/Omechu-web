// src/app/mypage/user-info-edit/[step]/page.tsx

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
import { stepComponents, StepKey } from "@/app/constant/UserInfoEditSteps";

type PageProps = {
  params: {
    step: StepKey;
  };
};

export default function StepPage({ params }: PageProps) {
  const Component = stepComponents[params.step];

  if (!Component) return notFound();

  return <Component />;
}
