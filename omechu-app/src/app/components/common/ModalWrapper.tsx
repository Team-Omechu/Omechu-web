"use client";

import { useEffect } from "react";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/utils/bodyScrollLock";

type ModalWrapperProps = {
  children: React.ReactNode;
};

export default function ModalWrapper({ children }: ModalWrapperProps) {
  useEffect(() => {
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#393939] bg-opacity-70">
      {children}
    </div>
  );
}
