"use client";

import { useEffect } from "react";

type ModalWrapperProps = {
  children: React.ReactNode;
};

export default function ModalWrapper({ children }: ModalWrapperProps) {
  // body 스크롤 막기
  useEffect(() => {
    const originalStyle = window.document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle; // 복구
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#393939] bg-opacity-40">
      {children}
    </div>
  );
}
