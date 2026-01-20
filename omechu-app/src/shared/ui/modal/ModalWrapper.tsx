//! 26.01.12 작업 완료

"use client";

import { useEffect } from "react";

import { lockBodyScroll, unlockBodyScroll } from "@/shared/lib/bodyScrollLock";

import { cn } from "@/shared/lib/cn.util";


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

      className="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      {/* dim overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* modal content */}
      <div className="relative z-10 opacity-100">{children}</div>

      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        className,
      )}

      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>

    </div>
  );
}
