// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// // Step 컴포넌트 import
// import GenderStep from "./steps/GenderStep";
// import FoodStep from "./steps/FoodStep";
// import ConditionStep from "./steps/ConditionStep";
// import StateStep from "./steps/StateStep";
// import AllergyStep from "./steps/AllergyStep";

// // Zustand store import
// import { useOnboardingStore } from "@/lib/stores/onboarding.store";

// export default function StepPage({ params }: { params: { step: string } }) {
//   const { step } = params;
//   const router = useRouter();
//   const [isClient, setIsClient] = useState(false);

//   // hydration 이후에만 Zustand 접근 허용
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // 잘못된 step이 들어왔을 경우 fallback
//   const getStepComponent = () => {
//     switch (step) {
//       case "gender":
//         return <GenderStep />;
//       case "food":
//         return <FoodStep />;
//       case "condition":
//         return <ConditionStep />;
//       case "workout":
//         return <StateStep />;
//       case "allergy":
//         return <AllergyStep />;
//       default:
//         return <div>존재하지 않는 단계입니다. 😢</div>;
//     }
//   };

//   if (!isClient) return null;

//   return <>{getStepComponent()}</>;
// }
