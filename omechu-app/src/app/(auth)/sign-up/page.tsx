"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import BottomButton from "@/components/common/button/BottomButton";
import ModalWrapper from "@/components/common/ModalWrapper";
import Toast from "@/components/common/Toast";
import { termsForLocationInfo } from "@/constant/terms/locationInfo";
import { termsForPersonlInfo } from "@/constant/terms/personlInfo";
import { termsForService } from "@/constant/terms/service";
import {
  signupSchema,
  type SignupFormValues,
} from "@/auth/schemas/auth.schema";
import { useSignupMutation } from "@/lib/hooks/useAuth";
import { useAuthStore } from "@/lib/stores/auth.store";

import SignUpForm from "./components/SignUpForm";
import TermsModal from "./components/TermsModal";
import { agreeToTerms } from "./api/agreements";

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
      onSuccess: async () => {
        try {
          // 로그인은 하지 않지만, 동의 API는 보호되어 있음 → 실제 호출은 로그인 이후가 안전
          // 여기서는 성공적으로 회원가입 후 온보딩으로 이동하면 충분합니다.
          // 만약 회원가입 직후에 서버에 동의를 저장하고 싶다면,
          // 로그인 → 동의 호출 → 온보딩 순으로 흐름을 바꾸면 됩니다.
          setPassword(data.password);
          router.push("/onboarding/1");
        } catch (e) {
          // 동의 요청 실패는 가입/온보딩 흐름을 막지 않습니다. 필요시 재시도 가능
          console.warn("약관 동의 저장 실패(무시 가능):", e);
          router.push("/onboarding/1");
        }
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
                    : termsForLocationInfo
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
