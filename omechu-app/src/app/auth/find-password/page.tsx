"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Input from "@/app/components/auth/Input";
import SquareButton from "@/app/components/common/button/SquareButton";
import {
  findPasswordSchema,
  FindPasswordFormValues,
} from "@/lib/schemas/auth.schema";

export default function FindPasswordPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FindPasswordFormValues>({
    resolver: zodResolver(findPasswordSchema),
  });

  const onSubmit = async (data: FindPasswordFormValues) => {
    setApiError(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);

    if (data.email === "test@naver.com") {
      router.push("/auth/find-password/sent");
    } else {
      setApiError(
        "비밀번호 재설정 메일 발송에 실패했습니다. \n 이메일 주소를 다시 확인해 주세요.",
      );
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 pb-40">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-xl font-medium text-[#393939]">비밀번호 찾기</h1>
        <p className="text-sm font-normal text-[#828282]">
          가입하신 이메일 주소를 입력하여
          <br />
          비밀번호를 재설정하실 수 있어요
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2 pt-4"
      >
        <Input
          {...register("email")}
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          error={errors.email?.message}
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

      <div className="flex flex-col items-center gap-1 pt-1 text-[13px] text-[#828282]">
        <div className="flex items-center gap-4">
          <span>비밀번호가 생각났어요</span>
          <Link
            href="/auth/login"
            className="font-semibold text-[#494949] hover:underline"
          >
            로그인 하기
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span>계정이 아직 없어요</span>
          <Link
            href="/auth/signup"
            className="font-semibold text-[#494949] hover:underline"
          >
            회원가입하기
          </Link>
        </div>
      </div>

      {apiError && (
        <div className="mt-4 flex h-[70px] w-full items-center justify-center whitespace-pre-line rounded-md bg-[rgba(130,130,130,0.5)] text-center text-sm text-white">
          {apiError}
        </div>
      )}
    </div>
  );
}
