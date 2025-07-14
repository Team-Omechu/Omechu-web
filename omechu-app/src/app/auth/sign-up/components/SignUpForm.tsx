"use client";

import type {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import type { SignupFormValues } from "@/lib/schemas/auth.schema";

import TermsAgreement from "./TermsAgreement";
import UserInfoFields from "./UserInfoFields";

type ModalType = "service" | "privacy" | "location";

type SignUpFormProps = {
  register: UseFormRegister<SignupFormValues>;
  watch: UseFormWatch<SignupFormValues>;
  setValue: UseFormSetValue<SignupFormValues>;
  errors: FieldErrors<SignupFormValues>;
  setActiveModal: (modal: ModalType | null) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export default function SignUpForm({
  register,
  watch,
  setValue,
  errors,
  setActiveModal,
  onSubmit,
}: SignUpFormProps) {
  return (
    <form
      id="signup-form"
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-sm flex-col"
    >
      <UserInfoFields register={register} errors={errors} />

      <hr className="my-6 border-t border-[#A3A3A3]" />

      <TermsAgreement
        register={register}
        watch={watch}
        setValue={setValue}
        errors={errors}
        setActiveModal={setActiveModal}
      />
    </form>
  );
}
