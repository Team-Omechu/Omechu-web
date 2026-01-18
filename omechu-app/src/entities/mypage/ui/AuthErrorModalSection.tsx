"use client";

import { ModalWrapper } from "@/shared";
// TODO: FSD 위반 - entities에서 widgets를 import하면 안 됨
// AuthErrorModalSection을 widgets로 이동하거나, BaseModal로 대체 필요
import { LoginPromptModal2 } from "@/widgets/LoginModal";

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
