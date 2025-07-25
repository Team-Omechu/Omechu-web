"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import SquareButton from "@/components/common/button/SquareButton";
import Input from "@/components/common/Input";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/auth/schemas/auth.schema";

type ResetPasswordFormProps = {
  onFormSubmit: (data: ResetPasswordFormValues) => Promise<void>;
};

export default function ResetPasswordForm({
  onFormSubmit,
}: ResetPasswordFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input
            label="새 비밀번호"
            type="password"
            placeholder="●●●●●●"
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            showError={!!errors.password}
            errorMessage={errors.password?.message}
            description="* 대소문자, 숫자 및 특수문자 포함 8자 이상"
          />
        )}
      />

      <Controller
        name="passwordConfirm"
        control={control}
        render={({ field }) => (
          <Input
            label="새 비밀번호 재확인"
            type="password"
            placeholder="새 비밀번호를 다시 입력해주세요"
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            showError={!!errors.passwordConfirm}
            errorMessage={errors.passwordConfirm?.message}
          />
        )}
      />

      <div className="mt-8">
        <SquareButton
          type="submit"
          variant="red"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "설정 중..." : "비밀번호 설정하기"}
        </SquareButton>
      </div>
    </form>
  );
}
