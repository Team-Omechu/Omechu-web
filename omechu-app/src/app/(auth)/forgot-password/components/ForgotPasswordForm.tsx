"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import SquareButton from "@/components/common/button/SquareButton";
import Input from "@/components/common/Input";
import {
  findPasswordSchema,
  type FindPasswordFormValues,
} from "@/auth/schemas/auth.schema";

type ForgotPasswordFormProps = {
  onFormSubmit: (data: FindPasswordFormValues) => Promise<void>;
};

export default function ForgotPasswordForm({
  onFormSubmit,
}: ForgotPasswordFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FindPasswordFormValues>({
    resolver: zodResolver(findPasswordSchema),
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex w-full flex-col gap-2 pt-4"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              label="이메일"
              type="email"
              placeholder="이메일을 입력해주세요"
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              showError={!!errors.email}
              errorMessage={errors.email?.message}
            />
          )}
        />
        <div className="mt-4">
          <SquareButton
            type="submit"
            variant="red"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "메일 발송 중..." : "메일 발송하기"}
          </SquareButton>
        </div>
      </form>

      <div className="flex flex-col items-center gap-1 pt-1 text-sm text-grey-normalActive">
        <div className="flex items-center justify-center gap-4">
          <span>비밀번호가 생각났어요</span>
          <Link
            href="/sign-in"
            className="font-semibold text-grey-darkActive hover:underline"
          >
            로그인 하기
          </Link>
        </div>
        <div className="flex items-center justify-center gap-4">
          <span>계정이 아직 없어요</span>
          <Link
            href="/sign-up"
            className="font-semibold text-grey-darkActive hover:underline"
          >
            회원가입하기
          </Link>
        </div>
      </div>
    </>
  );
}
