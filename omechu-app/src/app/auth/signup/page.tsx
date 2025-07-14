"use client";
import React, { useState } from "react";

import Image from "next/image";

// import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Checkbox from "@/app/auth/components/Checkbox";
import Input from "@/app/auth/components/Input";
import TermsAgreement from "@/app/auth/components/TermsAgreement";
import TermsModal from "@/app/auth/components/TermsModal";
import BottomButton from "@/app/components/common/button/BottomButton";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import { termsForLocationlInfo } from "@/app/constant/terms/locationInfo";
import { termsForPersonlInfo } from "@/app/constant/terms/personlInfo";
import { termsForService } from "@/app/constant/terms/service";
import { signupSchema, SignupFormValues } from "@/lib/schemas/auth.schema";

type ModalType = "service" | "privacy" | "location";

export default function Signup() {
  // const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      termsService: false,
      termsPrivacy: false,
      termsLocation: false,
      termsAge: false,
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
    // TODO: 회원가입 API 연동
  };

  return (
    <div className="flex h-screen flex-col bg-[#F8D5FF]">
      <main className="flex-1 overflow-y-auto px-4 py-10">
        <form
          id="signup-form"
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-sm"
        >
          <h1 className="mb-8 text-center text-xl font-bold text-black">
            회원 정보를 입력해 주세요
          </h1>

          <div className="space-y-4">
            <Input
              {...register("email")}
              label="이메일"
              type="email"
              placeholder="example@email.com"
              error={errors.email?.message}
              rightAddon={
                <button
                  onClick={() => {}}
                  type="button"
                  className="h-[38px] rounded-[6px] bg-[#00B2FF] px-4 text-sm font-normal text-white hover:bg-[#00a0e6] active:scale-[.98] active:bg-[#008ecb]"
                >
                  인증번호 전송
                </button>
              }
            />
            <Input
              {...register("password")}
              label="비밀번호"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력해 주세요"
              error={errors.password?.message}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2"
                >
                  <Image
                    src="/eye_open.svg"
                    alt="toggle password visibility"
                    width={24}
                    height={24}
                  />
                </button>
              }
            />
            <p className="mt-1 -translate-y-3 text-xs text-[#828282]">
              * 영문, 숫자, 특수문자 포함 8자 이상
            </p>
            <Input
              {...register("passwordConfirm")}
              label="비밀번호 재확인"
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="비밀번호를 다시 입력해주세요"
              error={errors.passwordConfirm?.message}
              rightAddon={
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="p-2"
                >
                  <Image
                    src="/eye_open.svg"
                    alt="toggle password visibility"
                    width={24}
                    height={24}
                  />
                </button>
              }
            />
          </div>

          <hr className="my-6 border-[#E0DFFD]" />

          <TermsAgreement
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            setActiveModal={setActiveModal}
          />
        </form>
      </main>

      <footer className="w-full bg-[#F8D5FF] pb-[env(safe-area-inset-bottom)]">
        <BottomButton
          type="submit"
          form="signup-form"
          disabled={isSubmitting}
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
  );
}
