import { notFound } from "next/navigation";
import { stepComponents, StepKey } from "@/app/constant/UserInfoEditSteps";

// 현재 Next.js는 PageProps 타입을 내보내지 않으므로 직접 정의
interface PageProps {
  params: {
    step: string;
  };
}

export default function StepPage({ params }: PageProps) {
  // 타입 보장 및 잘못된 슬러그 방지
  const isValidStep = params.step in stepComponents;

  if (!isValidStep) return notFound();

  const Component = stepComponents[params.step as StepKey];
  return <Component />;
}
