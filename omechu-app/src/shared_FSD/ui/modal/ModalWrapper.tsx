//! 26.01.12 작업 완료

"use client";

import { useEffect } from "react";

import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import {
  lockBodyScroll,
  unlockBodyScroll,
} from "@/shared_FSD/lib/bodyScrollLock";

type ModalWrapperProps = {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
};

export function ModalWrapper({
  children,
  className,
  onClose,
}: ModalWrapperProps) {
  useEffect(() => {
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={twMerge(
        clsx("fixed inset-0 z-50 flex items-center justify-center"),
        className,
      )}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
