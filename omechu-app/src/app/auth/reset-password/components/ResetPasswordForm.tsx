"use client";

import { useState } from "react";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Input from "@/auth/components/Input";
import SquareButton from "@/components/common/button/SquareButton";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/schemas/auth.schema";

type ResetPasswordFormProps = {
  onFormSubmit: (data: ResetPasswordFormValues) => Promise<void>;
};

export default function ResetPasswordForm({
  onFormSubmit,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
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
      <Input
        {...register("password")}
        label="새 비밀번호"
        type={showPassword ? "text" : "password"}
        placeholder="●●●●●●"
        error={errors.password?.message}
        subText="* 대소문자, 숫자 및 특수문자 포함 8자 이상"
        rightAddon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-2"
          >
            <Image
              src={showPassword ? "/eye_open.svg" : "/eye_closed.svg"}
              alt="toggle password visibility"
              width={24}
              height={24}
            />
          </button>
        }
      />

      <Input
        {...register("passwordConfirm")}
        label="새 비밀번호 재확인"
        type={showPasswordConfirm ? "text" : "password"}
        placeholder="새 비밀번호를 다시 입력해주세요"
        error={errors.passwordConfirm?.message}
        rightAddon={
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            className="p-2"
          >
            <Image
              src={showPasswordConfirm ? "/eye_open.svg" : "/eye_closed.svg"}
              alt="toggle password visibility"
              width={24}
              height={24}
            />
          </button>
        }
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
