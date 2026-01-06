//! 26.01. 작업 완료

"use client";

import { useEffect } from "react";

import { lockBodyScroll, unlockBodyScroll } from "@/lib/utils/bodyScrollLock";

type ModalWrapperProps = {
  children: React.ReactNode;
};

export function ModalWrapper({ children }: ModalWrapperProps) {
  useEffect(() => {
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="bg-opacity-70 bg-foundation-grey-dark fixed inset-0 z-40 flex items-center justify-center"
    >
      {children}
    </div>
  );
}
