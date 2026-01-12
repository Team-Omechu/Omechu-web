"use client";

import { useState, useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { ApiClientError } from "@/entities/user/api/authApi";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/entities/user/model/auth.schema";
import { Button, FormField, Input, Toast } from "@/shared";

type ResetPasswordFormProps = {
  onFormSubmit: (data: ResetPasswordFormValues) => Promise<void>;
};

export default function ResetPasswordForm({
  onFormSubmit,
}: ResetPasswordFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  }, []);

  const onSubmitHandler = useCallback(
    async (values: ResetPasswordFormValues) => {
      try {
        await onFormSubmit(values);
      } catch (err: unknown) {
        const e = err as ApiClientError & { code?: string };
        const code = e?.code;
        let msg: string | null = null;
        switch (code) {
          case "E001":
          case "V002":
            msg = "링크가 만료되었어요.";
            break;
          case "E002":
            msg = "사용자를 찾을 수 없습니다. 다시 시도해 주세요.";
            break;
          case "V003":
            msg = "비밀번호 형식이 올바르지 않습니다.";
            break;
          default:
            msg = e?.message || "비밀번호 재설정에 실패했습니다.";
        }
        triggerToast(msg);
      }
    },
    [onFormSubmit, triggerToast],
  );

  // eslint-disable-next-line react-hooks/refs -- handleSubmit is from react-hook-form
  const onSubmit = handleSubmit(onSubmitHandler);

  return (
    <main className="flex h-[calc(100dvh-3rem)] flex-col items-center px-4 py-2">
      <Toast message={toastMessage} show={showToast} className="bottom-40" />

      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <FormField
              label="새 비밀번호"
              id="reset-password"
              helperText={
                (passwordBlurred && errors.password?.message) ||
                "* 영문 대소문자, 숫자, 특수문자 포함 8자 이상"
              }
              helperState={passwordBlurred && errors.password ? "error" : undefined}
            >
              <Input
                type="password"
                placeholder="새 비밀번호를 입력해주세요"
                value={field.value}
                onChange={field.onChange}
                onBlur={() => {
                  setPasswordBlurred(true);
                  field.onBlur();
                }}
                width="default"
                className="w-full"
              />
            </FormField>
          )}
        />

        <Controller
          name="passwordConfirm"
          control={control}
          render={({ field }) => (
            <FormField
              label="새 비밀번호 재확인"
              id="reset-password-confirm"
              helperText={
                errors.passwordConfirm?.message ||
                (errors.passwordConfirm && "* 새 비밀번호가 일치하지 않습니다!")
              }
              helperState={errors.passwordConfirm ? "error" : undefined}
            >
              <Input
                type="password"
                placeholder="새 비밀번호를 다시 입력해주세요"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                width="default"
                className="w-full"
              />
            </FormField>
          )}
        />

        <div className="mt-4">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "설정 중..." : "비밀번호 설정하기"}
          </Button>
        </div>
      </form>
    </main>
  );
}
