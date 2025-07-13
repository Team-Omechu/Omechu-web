import { notFound } from "next/navigation";
import {
  stepComponents,
  stepOrder,
  StepKey,
} from "@/app/constant/UserInfoEditSteps";

export function generateStaticParams() {
  return stepOrder.map((step) => ({ step }));
}

interface Props {
  params: {
    step: StepKey;
  };
}

export default function StepPage({ params }: Props) {
  const Component = stepComponents[params.step];

  if (!Component) return notFound();

  return <Component />;
}
