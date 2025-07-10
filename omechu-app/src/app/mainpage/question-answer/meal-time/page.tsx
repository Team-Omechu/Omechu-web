// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import ProgressBar from "@/app/components/common/ProgressBar";
// import ModalWrapper from "@/app/components/common/ModalWrapper";
// import AlertModal from "@/app/components/common/AlertModal";
// import BottomNav from "@/app/components/mainpage/BottomNav";

// export default function MealTimePage() {
//   const [selected, setSelected] = useState<string>("");
//   const [showModal, setShowModal] = useState(false);
//   const router = useRouter();

//   const meals = ["아침", "점심", "저녁", "야식"];

//   return (
//     <div className="flex flex-col w-full h-screen">
//       {/* 상단 진행 바 + 그만하기 버튼 */}
//       <div className="px-4 pt-5">
//         <ProgressBar
//           currentStep={1}
//           totalSteps={5}
//           onCancelClick={() => {
//             setShowModal(true);
//           }}
//         />
//       </div>

//       {/* 질문 & 선택지 */}
//       <main className="flex flex-col items-center justify-center flex-1 w-full gap-12">
//         <h2 className="text-2xl text-center">언제 먹는 건가요?</h2>

//         <div className="flex flex-col gap-4 w-60">
//           {meals.map((meal) => (
//             <button
//               key={meal}
//               onClick={() => {
//                 setSelected(meal);
//                 router.push("./purpose");
//               }}
//               className={`w-full h-12 rounded-md border text-lg
//                 ${
//                   selected === meal
//                     ? "bg-red-500 text-white border-red-500"
//                     : "bg-white text-red-500 border-red-500"
//                 }`}
//             >
//               {meal}
//             </button>
//           ))}
//         </div>
//       </main>

//       {/* 하단 건너뛰기 */}
//       <BottomNav showPrev={false} nextPath="./purpose" />
//       {showModal && (
//         <ModalWrapper>
//           <AlertModal
//             title="메뉴 추천을 중단하시겠어요?"
//             onConfirm={() => {
//               router.push("/");
//               setShowModal(false);
//             }}
//             onClose={() => {
//               setShowModal(false);
//             }}
//             confirmText="확인"
//           />
//         </ModalWrapper>
//       )}
//     </div>
//   );
// }
