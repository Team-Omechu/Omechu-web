export const dynamicParams = true;

// 필요 시
// export function generateStaticParams() {
//   return stepOrder.map((step) => ({ step }));
// }

import { notFound } from "next/navigation";
import { stepComponents } from "@/app/constant/UserInfoEditSteps";

export default function StepPage({ params }: { params: { step: string } }) {
  const Component = stepComponents[params.step as keyof typeof stepComponents];

  if (!Component) return notFound();

  return <Component />;
}
