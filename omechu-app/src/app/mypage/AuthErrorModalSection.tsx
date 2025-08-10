"use client";

import ModalWrapper from "@/components/common/ModalWrapper";
import LoginPromptModal2 from "@/mainpage/example_testpage/components/LoginPromptModal2";

interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

export default function AuthErrorModal({ onConfirm, onClose }: Props) {
  if (!open) return null;
  return (
    <ModalWrapper>
      <LoginPromptModal2 onConfirm={onConfirm} onClose={onClose} />
    </ModalWrapper>
  );
}
