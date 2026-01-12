<<<<<<< HEAD
//! 26.01.13 작업

import { notFound } from "next/navigation";

import AllergyForm from "./AllergyForm";
import FoodForm from "./FoodForm";
import StateForm from "./StateForm";
import { BASIC_STATE_STEPS, type BasicStateStep } from "../steps";
=======
import { notFound } from "next/navigation";

import { BASIC_STATE_STEPS, type BasicStateStep, STEP_LABEL } from "../steps";
>>>>>>> 97c55dc3 ([#220]fix:Button 공용 컴포넌트 수정)

type PageProps = {
  params: { step: string };
};

function isBasicStateStep(step: string): step is BasicStateStep {
  return (BASIC_STATE_STEPS as readonly string[]).includes(step);
}

<<<<<<< HEAD
export default async function BasicStateStepPage({ params }: PageProps) {
  const { step } = await params;

  if (!isBasicStateStep(step)) notFound();
  return (
    <main>
      {step === "state" && <StateForm />}
      {step === "food" && <FoodForm />}
      {step === "allergy" && <AllergyForm />}
=======
export default function BasicStateStepPage({ params }: PageProps) {
  const { step } = params;

  if (!isBasicStateStep(step)) notFound();
  return (
    <main className="">
      <h1>{STEP_LABEL[step]}</h1>
>>>>>>> 97c55dc3 ([#220]fix:Button 공용 컴포넌트 수정)
    </main>
  );
}
