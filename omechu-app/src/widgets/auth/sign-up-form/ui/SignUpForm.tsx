"use client";

import type { ModalType } from "../types";
import TermsAgreement from "./TermsAgreement";
import UserInfoFields from "./UserInfoFields";

type SignUpFormProps = {
  setActiveModal: (modal: ModalType | null) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export default function SignUpForm({
  setActiveModal,
  onSubmit,
}: SignUpFormProps) {
  return (
    <form
      id="signup-form"
      onSubmit={onSubmit}
      className="mx-auto flex w-full flex-col gap-6"
    >
      <UserInfoFields />

      {/* 구분선 */}
      <hr className="border-t border-font-placeholder" />

      <TermsAgreement setActiveModal={setActiveModal} />
    </form>
  );
}
