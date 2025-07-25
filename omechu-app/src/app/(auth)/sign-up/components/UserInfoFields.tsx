"use client";

import { useState } from "react";

import { useFormContext, Controller } from "react-hook-form";

import Input from "@/components/common/Input";
import type { SignupFormValues } from "@/auth/schemas/auth.schema";

export default function UserInfoFields() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormValues>();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const verificationCode = watch("verificationCode");

  return (
    <div className="space-y-4">
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
            onClick={() => {
              /* 인증번호 전송 로직 */
              setIsCodeSent(true);
            }}
            disabled={!field.value}
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
              buttonText="인증번호 확인"
              onClick={() => {
                /* 인증번호 확인 로직 */
              }}
              disabled={!verificationCode || verificationCode.length !== 6}
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
    </div>
  );
}
