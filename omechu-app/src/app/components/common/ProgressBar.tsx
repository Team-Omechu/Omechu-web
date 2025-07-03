import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import AlertModal from "./AlertModal";

type ProgressBarProps = {
  stepMap: { [key: string]: number };
}; // 키(문자열) : 값(숫자) 를 요소로 갖는 객체를 props 로 받음

export default function ProgressBar({ stepMap }: ProgressBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false); // 모달 상태

  const currentStep = stepMap[pathname] || 0;
  const totalSteps = Object.values(stepMap).length;

  return (
    <div className="flex flex-col w-full px-5">
      <div className="flex gap-1.5 pt-4 pb-3">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`w-16 h-2 rounded-3xl border-[1.5px] border-[#1F9BDA] ${
              index < currentStep ? "bg-[#1F9BDA]" : "bg-white"
            }`}
          ></div>
        ))}
      </div>
      <div>
        <button
          onClick={() => {
            setShowModal(true);
          }} // 모달 여는 기능
          className="w-[62px] h-6 p-1 bg-[#1F9BDA] hover:bg-[#1c8cc4] active:bg-[#197cae] flex items-center justify-center text-white text-xs font-light rounded-md"
        >
          그만하기
        </button>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-40">
          <AlertModal
            title={"기본 상태 입력을 중단하시겠어요?"}
            description={"지금까지 작성한 내용은 저장되지 않아요."}
            confirmText={"그만하기"}
            onClose={() => setShowModal(false)}
            onConfirm={() => router.push("/mypage/user-info-edit")}
          />
        </div>
      )}
    </div>
  );
}
