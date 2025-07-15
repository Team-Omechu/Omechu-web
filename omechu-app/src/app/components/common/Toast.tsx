// -----------------------------------------
//  Toast 컴포넌트
// ---------------------------------------------
//  간단한 알림 메시지를 화면 하단에 띄워주는 UI 컴포넌트
//
//  - `message`: 표시할 텍스트 (줄바꿈 포함 가능)
//  - `show`: true일 때만 화면에 표시
//  - `bottom`: 하단 여백 위치 (단위 포함된 문자열로 전달)
//
//  - 부드러운 fade in/out 포함
//  - `show`가 false일 경우 opacity만 줄었다가 300ms 후 DOM 제거
//  - 흔들리는 shake 애니메이션은 tailwind keyframes에 별도 정의 필요
//  - tailwind class의 bottom-[값]은 string props와 충돌 위험 있어 style 방식 병행
// --------------------------------------------------

import { useEffect, useState } from "react";

type ToastProps = {
  message: string; // 화면에 표시할 텍스트 메시지
  show: boolean; // 표시 여부. true일 경우만 화면에 표시
  bottom: string;
};

export default function Toast({ message, show, bottom = "80px" }: ToastProps) {
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
      className={`absolute left-1/2 z-50 flex w-full -translate-x-1/2 transform justify-center bottom-[${bottom}] `}
      style={{ bottom: `${bottom}` }}
    >
      <div
        className={`flex h-16 w-auto items-center justify-center rounded-xl bg-[#828282] px-5 py-3 text-center text-sm text-white shadow-lg backdrop-blur-sm transition-opacity duration-300 ${isHiding ? "opacity-0" : "animate-shake opacity-50"} `}
      >
        <span className="whitespace-pre-line text-center">{message}</span>
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
//       <Toast message={toastMessage} show={showToast} bottom="20px" />
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
// - bottom: string (하단 위치, 단위 포함. ex: "10px", "2rem" 등. 기본값 "80px")
