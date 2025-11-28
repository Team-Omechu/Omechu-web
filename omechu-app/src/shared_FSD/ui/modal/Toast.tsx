// -----------------------------------------
//  Toast 컴포넌트
// ---------------------------------------------
//  간단한 알림 메시지를 화면 하단에 띄워주는 UI 컴포넌트
//
//  - `message`: 표시할 텍스트 (줄바꿈 포함 가능)
//  - `show`: true일 때만 화면에 표시
//  - `className`: bottom- 클래스로 세부 위치 조정
//
//  - 부드러운 fade in/out 포함
//  - `show`가 false일 경우 opacity만 줄었다가 300ms 후 DOM 제거
//  - 흔들리는 shake 애니메이션은 tailwind keyframes에 별도 정의 필요
// --------------------------------------------------

import { useEffect, useState } from "react";

type ToastProps = {
  message: string; // 화면에 표시할 텍스트 메시지
  show: boolean; // 표시 여부. true일 경우만 화면에 표시
  className?: string;
};

export default function Toast({ message, show, className }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setIsHiding(false);
    } else {
      setIsHiding(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setIsHiding(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className={`absolute left-1/2 z-50 flex w-full -translate-x-1/2 transform justify-center ${className} `}
    >
      <div
        className={`bg-grey-normal-active flex h-16 w-auto items-center justify-center rounded-xl px-5 py-3 text-center text-sm text-white shadow-lg backdrop-blur-xs transition-opacity duration-300 ${isHiding ? "opacity-0" : "animate-shake opacity-50"} `}
      >
        <span className="text-center whitespace-pre-line">{message}</span>
      </div>
    </div>
  );
}

//** 사용 예시
// --------------------------------------------------
// import { useState } from "react";
// import Toast from "@/components/common/Toast";
//
// export default function ExampleComponent() {
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//
//   const triggerToast = (msg: string) => {
//     setToastMessage(msg);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 2500); // 2.5초 뒤 토스트 사라짐
//   };
//
//   return (
//     <>
//       <button onClick={() => triggerToast("비밀번호가\n일치하지 않습니다")}>
//         토스트 띄우기
//       </button>
//       <Toast message={toastMessage} show={showToast} className="bottom-20" />
//     </>
//   );
// }
//
// 필수 정의 state:
// - const [showToast, setShowToast] = useState(false);
// - const [toastMessage, setToastMessage] = useState("");
//
// 필수 props:
// - message: string (표시할 메시지)
// - show: boolean (표시 여부)
//
// 선택 props:
// - className: top, bottom 등 높이 관련 position class
