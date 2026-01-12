import { notFound } from "next/navigation";

import { BASIC_STATE_STEPS, type BasicStateStep, STEP_LABEL } from "../steps";

type PageProps = {
  params: { step: string };
};

function isBasicStateStep(step: string): step is BasicStateStep {
  return (BASIC_STATE_STEPS as readonly string[]).includes(step);
}

export default function BasicStateStepPage({ params }: PageProps) {
  const { step } = params;

  if (!isBasicStateStep(step)) notFound();
  return (
    <main className="">
      <h1>{STEP_LABEL[step]}</h1>
    </main>
  );
}
