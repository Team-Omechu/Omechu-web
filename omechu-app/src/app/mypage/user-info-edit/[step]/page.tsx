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

export default function StepPage({
  params,
}: {
  params: { step: keyof typeof stepComponents };
}) {
  const Component = stepComponents[params.step];

  if (!Component) return notFound();

  return <Component />;
}
