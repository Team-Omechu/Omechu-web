import { notFound } from "next/navigation";
import { stepComponents } from "@/app/constant/UserInfoEditSteps";

type StepKey = "start" | "gender" | "state" | "food" | "condition" | "allergy";

type Props = {
  params: {
    step: StepKey;
  };
};

export default function StepPage({ params }: Props) {
  const Component = stepComponents[params.step];

  if (!Component) return notFound();

  return <Component />;
}
