"use client";

import { notFound, useParams } from "next/navigation";
import { stepComponents, StepKey } from "@/app/constant/UserInfoEditSteps";

export default function StepPage() {
  const params = useParams();
  const step = params.step as StepKey;

  const Component = stepComponents[step];

  if (!Component) {
    return notFound();
  }

  return <Component />;
}
