"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Checkbox from "@/app/auth/components/Checkbox";
import InlineAlert from "@/app/auth/components/InlineAlert";
import Input from "@/app/auth/components/Input";
import SquareButton from "@/app/components/common/button/SquareButton";
import { loginSchema, LoginFormValues } from "@/lib/schemas/auth.schema";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    // 가상의 로그인 실패 시나리오
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoginError("이메일 또는 비밀번호가 \n 올바르지 않습니다.");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <Input
          {...register("email")}
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          error={errors.email?.message}
        />
        <Input
          {...register("password")}
          label="비밀번호"
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호를 입력해주세요"
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

        <div className="mt-4">
          <SquareButton
            type="submit"
            variant="red"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </SquareButton>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <Checkbox
            id="remember-me"
            label="로그인 상태 유지"
            {...register("rememberMe")}
          />
          <div className="flex items-center gap-2">
            <Link href="/auth/forgot-password" className="hover:underline">
              비밀번호 찾기
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/auth/sign-up" className="hover:underline">
              회원가입
            </Link>
          </div>
        </div>
      </form>

      <InlineAlert message={loginError!} />
    </>
  );
}
