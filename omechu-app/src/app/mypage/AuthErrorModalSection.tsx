import ModalWrapper from "@/components/common/ModalWrapper";
import LoginPromptModal2 from "@/mainpage/example_testpage/components/LoginPromptModal2";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function AuthErrorModal({ open, onConfirm, onClose }: Props) {
  if (!open) return null;
  return (
    <ModalWrapper>
      <LoginPromptModal2 onConfirm={onConfirm} onClose={onClose} />
    </ModalWrapper>
  );
}
