"use client";

import ModalWrapper from "@/components/common/ModalWrapper";
import LoginPromptModal2 from "@/mainpage/example_testpage/components/LoginPromptModal2";

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function AuthErrorModalSection({
  isOpen,
  onConfirm,
  onClose,
}: Props) {
  if (!isOpen) return null; // 모달 열림 여부 제어
  return (
    <ModalWrapper>
      <LoginPromptModal2 onConfirm={onConfirm} onClose={onClose} />
    </ModalWrapper>
  );
}
