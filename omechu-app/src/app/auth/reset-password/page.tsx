"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Input from "@/app/auth/components/Input";
import AlertModal from "@/app/components/common/AlertModal";
import SquareButton from "@/app/components/common/button/SquareButton";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/schemas/auth.schema";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push("/auth/login");
  };

  return (
    <>
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="text-xl font-medium text-[#393939]">
            비밀번호 재설정
          </h1>
          <p className="text-sm font-normal text-[#828282]">
            사용하실 새로운 비밀번호를 설정해 주세요
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
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
                  src={
                    showPasswordConfirm ? "/eye_open.svg" : "/eye_closed.svg"
                  }
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
      </div>
      {isModalOpen && (
        <ModalWrapper>
          <AlertModal
            title="비밀번호를 재설정했어요"
            description="새로운 비밀번호로 로그인하세요"
            confirmText="확인"
            onConfirm={handleModalConfirm}
          />
        </ModalWrapper>
      )}
    </>
  );
}
