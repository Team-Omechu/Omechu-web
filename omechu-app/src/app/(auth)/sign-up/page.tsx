"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
  ApiClientError,
  useSignupMutation,
  useLoginMutation,
  signupSchema,
  type SignupFormValues,
  useAuthStore,
} from "@/entities/user";
import { BottomButton, Header, ModalWrapper, Toast, TERMS_CONFIG } from "@/shared";
import {
  SignUpForm,
  TermsModal,
  type ModalType,
  MODAL_TO_TERMS_TYPE,
  MODAL_TO_FORM_FIELD,
} from "@/widgets/auth";

export default function SignUpPage() {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const { setPassword } = useAuthStore();
  const { mutate: signup, isPending: isSigningUp } = useSignupMutation();
  const { mutateAsync: loginAsync } = useLoginMutation();

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
          // 회원가입 직후 자동 로그인하여 토큰을 확보 → 온보딩 완료 API에서 401 방지
          await loginAsync({ email: data.email, password: data.password });
          setPassword(data.password);
          router.push("/onboarding/1");
        } catch (e: unknown) {
          // 자동 로그인 실패 시에도 온보딩으로 이동하되, 안내 토스트 노출
          const message =
            e instanceof Error
              ? e.message
              : "자동 로그인에 실패했습니다. 로그인 후 계속 진행해 주세요.";
          triggerToast(message);
          router.push("/onboarding/1");
        }
      },
      onError: (error: unknown) => {
        const e = error as ApiClientError & { code?: string };
        const msg: string = e?.message || "회원가입에 실패했습니다.";
        triggerToast(msg);
      },
    });
  };

  /** 약관 동의 확인 핸들러 */
  const handleTermsConfirm = () => {
    if (activeModal) {
      const termKey = MODAL_TO_FORM_FIELD[activeModal];
      setValue(termKey, true, { shouldValidate: true });
    }
    setActiveModal(null);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col">
        {/* 헤더 */}
        <Header onLeftClick={() => router.back()} />

        {/* 제목 */}
        <div className="px-5 py-5 text-center">
          <h1 className="text-body-2-bold text-font-high">
            회원 정보를 입력해 주세요
          </h1>
        </div>

        {/* 폼 영역 */}
        <main className="flex-1 px-5 pb-16">
          <SignUpForm
            setActiveModal={setActiveModal}
            onSubmit={handleSubmit(onSubmit)}
          />
        </main>

        {/* 하단 버튼 */}
        <BottomButton
          type="submit"
          form="signup-form"
          disabled={!isValid || isSigningUp}
          className="mx-auto max-w-[430px]"
        >
          {isSigningUp ? "가입하는 중..." : "가입하기"}
        </BottomButton>

        {/* 약관 모달 */}
        {activeModal && (
          <ModalWrapper>
            <TermsModal
              title={TERMS_CONFIG[MODAL_TO_TERMS_TYPE[activeModal]].title}
              terms={TERMS_CONFIG[MODAL_TO_TERMS_TYPE[activeModal]].data}
              onConfirm={handleTermsConfirm}
              onClose={() => setActiveModal(null)}
            />
          </ModalWrapper>
        )}

        <Toast message={toastMessage} show={showToast} className="bottom-20" />
      </div>
    </FormProvider>
  );
}
