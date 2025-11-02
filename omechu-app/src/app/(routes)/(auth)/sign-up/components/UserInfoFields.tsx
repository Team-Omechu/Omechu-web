"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

import Input from "@/components/common/Input";
import {
  useSendVerificationCodeMutation,
  useVerifyVerificationCodeMutation,
} from "@/lib/hooks/useAuth";
import type { SignupFormValues } from "@/auth/schemas/auth.schema";
import Toast from "@/components/common/Toast";
import { ApiClientError } from "@/lib/api/auth";

export default function UserInfoFields() {
  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<SignupFormValues>();
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [passwordConfirmBlurred, setPasswordConfirmBlurred] = useState(false);
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
    const emailToSend = getValues("email");
    // 폼 전체 검증을 트리거하지 않고, 이메일 형식만 로컬로 빠르게 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToSend)) {
      triggerToast("올바른 이메일 형식을 입력해 주세요.");
      return;
    }
    sendCode(emailToSend, {
      onSuccess: (data) => {
        setIsCodeSent(true);
        triggerToast(data.message);
      },
      onError: (error: unknown) => {
        const e = error as ApiClientError & { code?: string };
        let msg: string =
          e?.message ||
          "인증번호 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.";
        // 필요 시 코드 별 보완
        triggerToast(msg);
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
        onError: (error: unknown) => {
          const e = error as ApiClientError & {
            reason?: string;
            code?: string;
          };
          let msg: string = e?.reason || e?.message || "인증에 실패했습니다.";
          // V001, V002 코드에 대한 분기 처리는 유지하거나 백엔드 응답을 신뢰하고 제거할 수 있습니다.
          // 현재는 유지하겠습니다.
          switch (e?.code) {
            case "V001":
              msg = e.reason || "인증번호가 올바르지 않습니다.";
              break;
            case "V002":
              msg = e.reason || "인증번호가 만료되었어요. 다시 전송해 주세요.";
              break;
          }
          triggerToast(msg);
        },
      },
    );
  };

  return (
    <div className="relative space-y-4">
      <div className="[&_button]:w-[122px]">
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
      </div>
      {isCodeSent && (
        <div className="[&_button]:w-[122px]">
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
        </div>
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
            onBlur={() => {
              setPasswordBlurred(true);
              field.onBlur();
            }}
            showError={passwordBlurred && !!errors.password}
            // 에러일 때 동일 문구를 빨간색으로 표기, 아닐 때 회색 설명 문구
            description="* 영문 대소문자, 숫자, 특수문자 포함 8자 이상"
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
            onBlur={() => {
              setPasswordConfirmBlurred(true);
              field.onBlur();
            }}
            showError={passwordConfirmBlurred && !!errors.passwordConfirm}
            errorMessage="비밀번호를 다시 입력해주세요."
          />
        )}
      />
      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </div>
  );
}
