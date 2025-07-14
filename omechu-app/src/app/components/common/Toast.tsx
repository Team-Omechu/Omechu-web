// Toast.tsx

import { useEffect, useState } from "react";

/**
 * Toast 컴포넌트
 *
 * 간단한 알림 메시지를 화면 중앙에 띄워주는 UI 컴포넌트입니다.
 * `message`는 표시할 텍스트이며, `show`가 true일 때에만 화면에 표시됩니다.
 *
 * - 포지션은 화면 중앙 고정(top-2/4, left-1/2)
 * - 부드러운 fade in/out 효과 포함
 * - `show`가 false일 경우 null을 반환하여 렌더링하지 않음
 */

type ToastProps = {
  message: string; // 화면에 표시할 텍스트 메시지
  show: boolean; // 표시 여부. true일 경우만 화면에 표시
};

export default function Toast({ message, show }: ToastProps) {
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
    <div className="fixed bottom-56 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform">
      <div
        className={`flex h-fit w-fit items-center justify-center rounded-xl bg-[#828282cc] px-10 py-5 text-sm text-white shadow-md transition-opacity duration-300 ${isHiding ? "opacity-0" : "animate-shake opacity-70"}`}
      >
        {message}
      </div>
    </div>
  );
}

/**
 * 사용 예시
 * --------------------------------------------------
 * import { useState } from "react";
 * import Toast from "@/components/common/Toast";
 *
 * export default function ExampleComponent() {
 *   const [showToast, setShowToast] = useState(false);
 *   const [toastMessage, setToastMessage] = useState("");
 *
 *   const triggerToast = (msg: string) => {
 *     setToastMessage(msg);
 *     setShowToast(true);
 *     setTimeout(() => setShowToast(false), 2500); // 2.5초 뒤 토스트 사라짐
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={() => triggerToast("알림 메시지 예시입니다")}>
 *         토스트 띄우기
 *       </button>
 *
 *       <Toast message={toastMessage} show={showToast} />
 *     </>
 *   );
 * }
 *
 * 필수 정의 state:
 * - const [showToast, setShowToast] = useState(false);
 * - const [toastMessage, setToastMessage] = useState("");
 *
 * 필수 props:
 * - message: string (표시할 메시지)
 * - show: boolean (표시 여부)
 */
