// src/app/mypage/user-info-edit/[step]/page.tsx

export const dynamicParams = true;
export const dynamic = "auto";
import { notFound } from "next/navigation";
import { stepComponents } from "@/app/constant/UserInfoEditSteps";

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

type StepPageProps = {
  params: {
    step: string;
  };
};

export default function StepPage({ params }: StepPageProps) {
  const Component = stepComponents[params.step as keyof typeof stepComponents];

  if (!Component) return notFound();

  return <Component />;
}
