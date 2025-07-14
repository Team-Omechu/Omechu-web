import { notFound } from "next/navigation";
import { stepComponents } from "@/app/constant/UserInfoEditSteps";

export const dynamicParams = true;
export const dynamic = "auto";

export default function StepPage(props: any) {
  const step = props?.params?.step as keyof typeof stepComponents;
  const Component = stepComponents[step];

  if (!Component) return notFound();
  return <Component />;
}
