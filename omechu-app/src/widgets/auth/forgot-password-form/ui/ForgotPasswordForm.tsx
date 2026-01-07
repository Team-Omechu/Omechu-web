"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { Button } from "@/shared/ui/button/Button";
import { Input } from "@/shared/ui/input/Input";
import {
  findPasswordSchema,
  type FindPasswordFormValues,
} from "../../../../entities/user/model/auth.schema";

type ForgotPasswordFormProps = {
  onFormSubmit: (data: FindPasswordFormValues) => Promise<void>;
};

export default function ForgotPasswordForm({
  onFormSubmit,
}: ForgotPasswordFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FindPasswordFormValues>({
    resolver: zodResolver(findPasswordSchema),
    mode: "onChange", // 입력값이 변경될 때마다 유효성 검사 실행
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
            disabled={!isValid || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "메일 발송 중..." : "메일 발송하기"}
          </SquareButton>
        </div>
      </form>

      <div className="text-grey-normal-active flex flex-col items-center gap-1 pt-1 text-sm">
        <div className="flex items-center justify-center gap-4">
          <span>비밀번호가 생각났어요</span>
          <Link
            href="/sign-in"
            className="text-grey-dark-active font-semibold hover:underline"
          >
            로그인 하기
          </Link>
        </div>
        <div className="flex items-center justify-center gap-4">
          <span>계정이 아직 없어요</span>
          <Link
            href="/sign-up"
            className="text-grey-dark-active font-semibold hover:underline"
          >
            회원가입하기
          </Link>
        </div>
      </div>
    </>
  );
}
