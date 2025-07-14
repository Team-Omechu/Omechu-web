"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Button from "@/app/components/auth/Button";
import Input from "@/app/components/auth/Input";
import { loginSchema, LoginFormValues } from "@/lib/schemas/auth.schema";

export default function LoginPage() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    console.log(data);
    setLoginError("이메일 또는 비밀번호가 \n 올바르지 않습니다.");
  };

  return (
    <div className="flex w-full flex-col items-center gap-8 py-10">
      <Link href="/">
        <Image
          src="/오메추-로고-보라색버전-모자4 1.png" // public 폴더의 로고 이미지
          alt="Omechu Logo"
          width={139}
          height={92}
          priority
        />
      </Link>

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
                src={showPassword ? "/비밀번호보기.svg" : "/mdi-light_eye.svg"}
                alt="toggle password visibility"
                width={24}
                height={24}
              />
            </button>
          }
        />

        <div className="mt-4">
          <Button
            type="submit"
            variant="red"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
              {...register("rememberMe")}
            />
            <span>로그인 상태 유지</span>
          </label>
          <div className="flex items-center gap-2">
            <Link href="/auth/find-password" className="hover:underline">
              비밀번호 찾기
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/auth/signup" className="hover:underline">
              회원가입
            </Link>
          </div>
        </div>
      </form>

      <div className="relative flex w-full items-center">
        <hr className="w-full border-t border-gray-300" />
        <span className="absolute left-1/2 -translate-x-1/2 bg-[#F8D5FF] px-2 text-xs text-gray-400">
          or
        </span>
      </div>

      <Button
        variant="yellow"
        size="large"
        leftIcon={
          <Image src="/kakao.png" alt="카카오 아이콘" width={24} height={24} />
        }
      >
        카카오 로그인
      </Button>

      {loginError && (
        <div className="mt-4 flex h-[70px] w-full items-center justify-center whitespace-pre-line rounded-md bg-[rgba(130,130,130,0.5)] text-center text-sm text-white">
          {loginError}
        </div>
      )}
    </div>
  );
}
