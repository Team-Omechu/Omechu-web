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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unlockBodyScroll();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        className,
      )}
    >
      {/* dim overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal content */}
      <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
