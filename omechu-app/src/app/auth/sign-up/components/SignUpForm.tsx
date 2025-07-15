"use client";

import type { SubmitHandler } from "react-hook-form";

import TermsAgreement from "./TermsAgreement";
import UserInfoFields from "./UserInfoFields";

type ModalType = "service" | "privacy" | "location";

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
      className="mx-auto flex w-full max-w-sm flex-col"
    >
      <UserInfoFields />

      <hr className="my-6 border-t border-[#A3A3A3]" />

      <TermsAgreement setActiveModal={setActiveModal} />
    </form>
  );
}
