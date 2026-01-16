//! 26.01. 작업 완료

"use client";

import { useEffect } from "react";

import { lockBodyScroll, unlockBodyScroll } from "@/shared/lib/bodyScrollLock";

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
      className="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      {/* dim overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* modal content */}
      <div className="relative z-10 opacity-100">{children}</div>
    </div>
  );
}
