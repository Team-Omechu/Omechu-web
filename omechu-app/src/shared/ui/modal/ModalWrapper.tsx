//! 26.01. 작업 완료

"use client";

import { useEffect } from "react";

import {
  lockBodyScroll,
  unlockBodyScroll,
} from "@/shared/lib/bodyScrollLock";

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
      className="fixed inset-0 z-40 flex items-center justify-center bg-white opacity-5"
    >
      {children}
    </div>
  );
}
