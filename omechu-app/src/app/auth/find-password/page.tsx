"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  findPasswordSchema,
  FindPasswordFormValues,
} from "@/lib/schemas/auth.schema";
import Button from "@/app/components/auth/Button";
import Input from "@/app/components/auth/Input";
import { useRouter } from "next/navigation";

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
        "비밀번호 재설정 메일 발송에 실패했습니다. 이메일 주소를 다시 확인해 주세요."
      );
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen gap-8 py-10">
      <div className="flex items-center justify-center h-[180px]">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-xl font-medium text-[#393939]">비밀번호 찾기</h1>
          <p className="text-[15px] font-normal text-[#828282]">
            가입하신 이메일 주소를 입력하여
            <br />
            비밀번호를 재설정하실 수 있어요
          </p>
        </div>
      </div>

      <div className="flex flex-col flex-grow w-full">
        <div className="flex flex-col w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-4"
          >
            <Input
              {...register("email")}
              label="이메일"
              type="email"
              placeholder="이메일을 입력해주세요"
              error={errors.email?.message}
            />
            <div className="mt-4">
              <Button
                type="submit"
                variant="red"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? "메일 발송 중..." : "메일 발송하기"}
              </Button>
            </div>
          </form>

          <div className="flex flex-col items-center gap-2 mt-10 text-[13px] text-[#828282]">
            <div className="flex items-center gap-4">
              <span>비밀번호가 생각났어요</span>
              <Link
                href="/auth/login"
                className="font-medium text-[#494949] hover:underline"
              >
                로그인 하기
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span>계정이 아직 없어요</span>
              <Link
                href="/auth/signup"
                className="font-medium text-[#494949] hover:underline"
              >
                회원가입하기
              </Link>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="mt-auto w-full h-[70px] flex items-center justify-center text-[15px] text-center text-white bg-[rgba(130,130,130,0.5)] rounded-[5px]">
            {apiError}
          </div>
        )}
      </div>
    </div>
  );
}
