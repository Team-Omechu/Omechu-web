"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import BottomButton from "@/app/components/common/button/BottomButton";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import { termsForLocationlInfo } from "@/app/constant/terms/locationInfo";
import { termsForPersonlInfo } from "@/app/constant/terms/personlInfo";
import { termsForService } from "@/app/constant/terms/service";
import { signupSchema, type SignupFormValues } from "@/lib/schemas/auth.schema";

import SignUpForm from "./components/SignUpForm";
import TermsModal from "./components/TermsModal";

type ModalType = "service" | "privacy" | "location";

export default function SignUpPage() {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      verificationCode: "",
      termsService: false,
      termsPrivacy: false,
      termsLocation: false,
      termsAge: false,
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: SignupFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: Navigate to next page on success
  };

  return (
    <FormProvider {...methods}>
      <div className="flex h-screen flex-col">
        <header className="px-4 py-5 text-center">
          <h1 className="py-10 text-xl font-bold text-[#393939]">
            회원 정보를 입력해 주세요
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto px-5">
          <SignUpForm
            setActiveModal={setActiveModal}
            onSubmit={handleSubmit(onSubmit)}
          />
        </main>

        <footer className="w-full pb-[env(safe-area-inset-bottom)]">
          <BottomButton
            type="submit"
            form="signup-form"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "가입하는 중..." : "가입하기"}
          </BottomButton>
        </footer>

        {activeModal && (
          <ModalWrapper>
            <TermsModal
              title={
                activeModal === "service"
                  ? "서비스 이용약관"
                  : activeModal === "privacy"
                    ? "개인정보 처리방침"
                    : "위치기반서비스 이용약관"
              }
              terms={
                activeModal === "service"
                  ? termsForService
                  : activeModal === "privacy"
                    ? termsForPersonlInfo
                    : termsForLocationlInfo
              }
              onConfirm={() => {
                if (activeModal) {
                  const termKey =
                    activeModal === "service"
                      ? "termsService"
                      : activeModal === "privacy"
                        ? "termsPrivacy"
                        : "termsLocation";
                  setValue(termKey, true, { shouldValidate: true });
                }
                setActiveModal(null);
              }}
              onClose={() => setActiveModal(null)}
            />
          </ModalWrapper>
        )}
      </div>
    </FormProvider>
  );
}
