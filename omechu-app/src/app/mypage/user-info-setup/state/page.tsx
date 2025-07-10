// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// import AlertModal from "@/app/components/common/AlertModal";
// import ModalWrapper from "@/app/components/common/ModalWrapper";
// import ProgressBar from "@/app/components/common/ProgressBar";

// export default function SetupState() {
//   const router = useRouter();
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <div className="relative flex flex-col w-auto h-screen">
//       <ProgressBar
//         currentStep={2}
//         totalSteps={5}
//         onCancelClick={() => setShowModal(true)}
//         cancelButtonText="그만하기"
//       />
//       <main className="flex flex-col items-center w-full px-4 py-6 min-h-[calc(100vh-9rem)]">
//         <section className="my-20">
//           <div className="px-10 text-3xl font-medium leading-relaxed text-center whitespace-pre">
//             지금 어떤 운동 상태에{"\n"}
//             가까운가요?
//           </div>
//         </section>
//         <section className="flex flex-col items-center justify-center -mt-4">
//           <div className="z-10 flex flex-col gap-5">
//             {["다이어트 중", "증량 중", "유지 중"].map((item, index) => (
//               <button
//                 key={index}
//                 className="w-60 h-12 p-2  text-xl text-[#FB4746] hover:text-white
//                           border-[1px] rounded-md border-[#FB4746]
//                           bg-white
//                           hover:bg-[#e2403f]
//                           active:bg-[#c93938]"
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </section>
//       </main>
//       <footer className="flex flex-col w-full pb-[env(safe-area-inset-bottom)] gap-3">
//         <div className="flex justify-between">
//           <button
//             onClick={() => {
//               router.push("./gender");
//             }}
//             className="ml-5 text-base text-[#828282] dark:text-white dark:font-semibold"
//           >
//             {"<"} 이전으로
//           </button>
//           <button
//             onClick={() => {
//               router.push("./food");
//             }}
//             className="mr-5 text-base text-[#828282] dark:text-white dark:font-semibold"
//           >
//             건너뛰기 {">"}
//           </button>
//         </div>
//         <button
//           onClick={() => {
//             router.push("./food");
//           }}
//           className="p-2 min-w-full h-12 rounded-t-md
//                     text-white text-xl font-normal
//                     bg-[#1F9BDA] dark:bg-[#1774a4]
//                     hover:bg-[#1c8cc4] dark:hover:bg-[#135d83]
//                     active:bg-[#197cae] dark:active:bg-[#0e4662]"
//         >
//           다음
//         </button>
//       </footer>
//       {showModal && (
//         <ModalWrapper>
//           <AlertModal
//             title="기본 상태 입력을 중단하시겠어요?"
//             description="지금까지 작성한 내용은 저장되지 않아요."
//             confirmText="그만하기"
//             cancelText="돌아가기"
//             onConfirm={() => {
//               setShowModal(false);
//               router.push("./state"); // 원하는 페이지로 이동
//             }}
//             onClose={() => setShowModal(false)}
//           />
//         </ModalWrapper>
//       )}
//     </div>
//   );
// }
