"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

import Input from "@/components/common/Input";
import {
  useSendVerificationCodeMutation,
  useVerifyVerificationCodeMutation,
} from "@/auth/hooks/useAuth";
import type { SignupFormValues } from "@/auth/schemas/auth.schema";
import Toast from "@/components/common/Toast";

export default function UserInfoFields() {
  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<SignupFormValues>();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const verificationCode = watch("verificationCode");
  const email = watch("email");

  const { mutate: sendCode, isPending: isSending } =
    useSendVerificationCodeMutation();
  const { mutate: verifyCode, isPending: isVerifying } =
    useVerifyVerificationCodeMutation();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleSendCode = () => {
    sendCode(getValues("email"), {
      onSuccess: (data) => {
        setIsCodeSent(true);
        triggerToast(data.message);
      },
      onError: (error: any) => {
        triggerToast(`인증번호 전송 실패: ${error.message}`);
      },
    });
  };

  const handleVerifyCode = () => {
    if (!verificationCode) return;
    verifyCode(
      { email, code: verificationCode },
      {
        onSuccess: (data) => {
          setIsVerified(true);
          triggerToast(data.message);
        },
        onError: (error: any) => {
          triggerToast(`인증 실패: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="relative space-y-4">
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            label="이메일"
            type="email"
            placeholder="example@email.com"
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            showError={!!errors.email}
            errorMessage={errors.email?.message}
            showButton={true}
            buttonText={isCodeSent ? "인증번호 재전송" : "인증번호 전송"}
            onClick={handleSendCode}
            disabled={!field.value || isSending || isVerified}
          />
        )}
      />
      {isCodeSent && (
        <Controller
          name="verificationCode"
          control={control}
          render={({ field }) => (
            <Input
              label="인증번호"
              type="text"
              placeholder="인증번호 6자리를 입력해주세요"
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              showError={!!errors.verificationCode}
              errorMessage={errors.verificationCode?.message}
              showButton={true}
              buttonText={isVerified ? "인증 완료" : "인증번호 확인"}
              onClick={handleVerifyCode}
              disabled={
                !verificationCode ||
                verificationCode.length !== 6 ||
                isVerifying ||
                isVerified
              }
            />
          )}
        />
      )}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            showError={!!errors.password}
            errorMessage={errors.password?.message}
            description="* 영문, 숫자, 특수문자 포함 8자 이상"
          />
        )}
      />
      <Controller
        name="passwordConfirm"
        control={control}
        render={({ field }) => (
          <Input
            label="비밀번호 재확인"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            showError={!!errors.passwordConfirm}
            errorMessage={errors.passwordConfirm?.message}
          />
        )}
      />
      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </div>
  );
}
