"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import BottomButton from "@/components/common/button/BottomButton";
import ModalWrapper from "@/components/common/ModalWrapper";
import Toast from "@/components/common/Toast";
import { termsForLocationlInfo } from "@/constant/terms/locationInfo";
import { termsForPersonlInfo } from "@/constant/terms/personlInfo";
import { termsForService } from "@/constant/terms/service";
import {
  signupSchema,
  type SignupFormValues,
} from "@/auth/schemas/auth.schema";
import { useSignupMutation, useLoginMutation } from "@/auth/hooks/useAuth";
import { useAuthStore } from "@/auth/store";

import SignUpForm from "./components/SignUpForm";
import TermsModal from "./components/TermsModal";

type ModalType = "service" | "privacy" | "location";

export default function SignUpPage() {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const { setPassword } = useAuthStore();
  const { mutate: signup, isPending: isSigningUp } = useSignupMutation();

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
    formState: { isValid },
  } = methods;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const onSubmit = (data: SignupFormValues) => {
    signup(data, {
      onSuccess: () => {
        setPassword(data.password);
        router.push("/onboarding/1");
      },
      onError: (error) => {
        triggerToast(`회원가입에 실패했습니다:\n${error.message}`);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="flex h-screen flex-col">
        <header className="px-4 py-5 text-center">
          <h1 className="py-10 text-xl font-bold text-grey-darker">
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
            disabled={!isValid || isSigningUp}
          >
            {isSigningUp ? "가입하는 중..." : "가입하기"}
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
        <Toast message={toastMessage} show={showToast} className="bottom-20" />
      </div>
    </FormProvider>
  );
}
