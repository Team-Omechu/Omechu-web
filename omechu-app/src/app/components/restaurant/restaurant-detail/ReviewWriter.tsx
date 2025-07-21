// "use client";

// import { useState } from "react";

import ModalWrapper from "@/components/common/ModalWrapper";
// import ReviewModal from "@/components/restaurant/restaurant-detail/modal/ReviewModal";

// interface Props {
//   restaurantName: string;
// }

// export default function ReviewWriter({ restaurantName }: Props) {
//   const [showModal, setShowModal] = useState(false);

//   return (
//     <section className="flex flex-col items-center w-full gap-5 mt-5">
//       <div className="h-[2px] w-full bg-[#828282] opacity-40" />
//       <div className="flex flex-col items-center gap-1">
//         <div className="flex gap-1">
//           {Array.from({ length: 5 }, (_, index) => (
//             <button
//               key={index}
//               onClick={() => setShowModal(true)}
//               className="h-fit w-fit text-3xl text-[#1F9BDA]"
//             >
//               ☆
//             </button>
//           ))}
//         </div>
//         {showModal && (
//           <ModalWrapper>
//             <ReviewModal
//               restaurantName={restaurantName}
//               onClose={() => setShowModal(false)}
//               onSubmit={(rating, tags, images, comment) => {
//                 console.log({ rating, tags, images, comment });
//                 setShowModal(false);
//               }}
//             />
//           </ModalWrapper>
//         )}
//         <span className="text-base font-normal text-[#828282]">
//           후기를 남겨주세요!
//         </span>
//       </div>
//       <div className="h-[2px] w-full bg-[#828282] opacity-40" />
//     </section>
//   );
// }
