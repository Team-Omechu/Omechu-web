"use client";

import { useState } from "react";

import Image from "next/image";

import { useFormContext } from "react-hook-form";

import type { SignupFormValues } from "@/lib/schemas/auth.schema";

import Input from "../../components/Input";

export default function UserInfoFields() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SignupFormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const verificationCode = watch("verificationCode");

  return (
    <div className="space-y-4">
      <Input
        {...register("email")}
        label="이메일"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        rightAddon={
          <button
            onClick={() => {
              /* 인증번호 전송 로직 */
              setIsCodeSent(true);
            }}
            type="button"
            className="h-[38px] rounded-[6px] bg-[#00B2FF] px-4 text-sm font-normal text-white hover:bg-[#00a0e6] active:scale-[.98] active:bg-[#008ecb]"
          >
            {isCodeSent ? "인증번호 재전송" : "인증번호 전송"}
          </button>
        }
      />
      {isCodeSent && (
        <Input
          {...register("verificationCode")}
          label="인증번호"
          type="text"
          placeholder="인증번호 6자리를 입력해주세요"
          error={errors.verificationCode?.message}
          rightAddon={
            <button
              onClick={() => {
                /* 인증번호 확인 로직 */
              }}
              type="button"
              disabled={!verificationCode || verificationCode.length !== 6}
              className="h-[38px] rounded-[6px] bg-[#00B2FF] px-4 text-sm font-normal text-white hover:bg-[#00a0e6] active:scale-[.98] active:bg-[#008ecb] disabled:bg-[#A3A3A3]"
            >
              인증번호 확인
            </button>
          }
        />
      )}
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
              src={showPassword ? "/eye_open.svg" : "/eye_closed.svg"}
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
              src={showPasswordConfirm ? "/eye_open.svg" : "/eye_closed.svg"}
              alt="toggle password visibility"
              width={24}
              height={24}
            />
          </button>
        }
      />
    </div>
  );
} 