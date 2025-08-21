"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Input from "@/components/common/Input";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";
import Toast from "@/components/common/Toast";
import { useState } from "react";
import SquareButton from "@/components/common/button/SquareButton";
import { ApiClientError } from "@/lib/api/auth";

type ResetPasswordFormProps = {
  onFormSubmit: (data: ResetPasswordFormValues) => Promise<void>;
};

export default function ResetPasswordForm({
  onFormSubmit,
}: ResetPasswordFormProps) {
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [inputNewPassword, setInputNewPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState<boolean | null>(
    null,
  );
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    boolean | null
  >(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  };

  const handleSubmitInternal = async () => {
    try {
      // react-hook-form's state is updated before submission
      setValue("password", inputNewPassword);
      setValue("passwordConfirm", inputConfirmPassword);
      await handleSubmit(async (values) => {
        await onFormSubmit(values);
      })();
    } catch (err: unknown) {
      const e = err as ApiClientError & { code?: string };
      const code = e?.code;
      let msg: string | null = null;
      switch (code) {
        case "E001": // InvalidOrExpiredTokenError
        case "V002": // VerificationCodeExpiredError (혹시 토큰 검증 흐름 포함 시)
          msg = "링크가 만료되었어요. 이메일에서 새 링크로 다시 시도해 주세요.";
          break;
        case "E002": // UserNotFoundError
          msg = "사용자를 찾을 수 없습니다. 다시 시도해 주세요.";
          break;
        case "V003": // InvalidPasswordError
          msg = "비밀번호 형식이 올바르지 않습니다.";
          break;
        default:
          msg = e?.message || "비밀번호 재설정에 실패했습니다.";
      }
      triggerToast(msg);
    }
  };

  const hasPasswordError = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;
    return !regex.test(password);
  };

  const isFormValid =
    !hasPasswordError(inputNewPassword) &&
    inputNewPassword.length > 0 &&
    inputConfirmPassword.length > 0 &&
    inputNewPassword === inputConfirmPassword;

  return (
    <main className="flex h-[calc(100dvh-3rem)] flex-col items-center px-4 py-2">
      {/* 토스트: fixed로 포지셔닝(SSR/스크롤 영향 최소화) */}
      <Toast
        message={toastMessage}
        show={showToast}
        className="fixed bottom-24 left-1/2 z-[9999] -translate-x-1/2"
      />

      <section className="flex w-full flex-col gap-4 px-3 pt-16">
        <Input
          label="새 비밀번호"
          type="password"
          value={inputNewPassword}
          placeholder="새 비밀번호를 입력해주세요"
          onChange={(v) => {
            setInputNewPassword(v);
            if (newPasswordError) setNewPasswordError(null);
            setValue("password", v);
          }}
          onBlur={() => setNewPasswordError(hasPasswordError(inputNewPassword))}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              setNewPasswordError(hasPasswordError(inputNewPassword));
          }}
          errorMessage="* 영문 대소문자, 숫자, 특수문자 포함 8자 이상"
          showError={newPasswordError === true}
        />

        <Input
          label="새 비밀번호 재확인"
          type="password"
          value={inputConfirmPassword}
          placeholder="새 비밀번호를 다시 입력해주세요"
          onChange={(v) => {
            setInputConfirmPassword(v);
            if (confirmPasswordError) setConfirmPasswordError(null);
            setValue("passwordConfirm", v);
          }}
          onBlur={() =>
            setConfirmPasswordError(inputConfirmPassword !== inputNewPassword)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setConfirmPasswordError(
                inputConfirmPassword !== inputNewPassword,
              );
            }
          }}
          errorMessage="* 새 비밀번호가 일치하지 않습니다!"
          showError={confirmPasswordError === true}
        />
      </section>

      <section className="relative mt-5 flex w-full flex-col items-center">
        <SquareButton
          type="button"
          onClick={handleSubmitInternal}
          variant="red"
          size="md"
          disabled={!isFormValid || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "설정 중..." : "비밀번호 설정하기"}
        </SquareButton>
      </section>
    </main>
  );
}
