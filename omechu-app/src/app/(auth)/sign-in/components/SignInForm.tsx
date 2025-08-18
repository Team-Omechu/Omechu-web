"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import Checkbox from "@/auth/components/Checkbox";
import SquareButton from "@/components/common/button/SquareButton";
import Input from "@/components/common/Input";
import Toast from "@/components/common/Toast";
import { useAuthStore } from "@/lib/stores/auth.store";
import { loginSchema, LoginFormValues } from "@/auth/schemas/auth.schema";
import { useLoginMutation } from "@/lib/hooks/useAuth";

export default function SignInForm() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimerRef = useRef<number | null>(null);
  const navigatedRef = useRef(false);

  const router = useRouter();

  const { mutate: login, isPending, isSuccess, error } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setShowToast(false);
      toastTimerRef.current = null;
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, []);

  const onSubmit = (data: LoginFormValues) => {
    // API가 rememberMe를 안 받는다면 필요한 필드만 전달
    // const { email, password } = data;
    // login({ email, password });

    login(data);
  };

  // 로그인 응답은 토큰 중심으로 처리되고, 최종 유저 정보는 전역에서 /profile 동기화된다고 가정
  const user = useAuthStore((s) => s.user);

  // 최종 유저 프로필 동기화 완료 후 라우팅 (중복 이동 방지)
  useEffect(() => {
    if (navigatedRef.current) return;
    if (!isSuccess || !user?.email) return;

    if (user.nickname && user.nickname.trim().length > 0) {
      navigatedRef.current = true;
      router.push("/mainpage");
    } else {
      navigatedRef.current = true;
      router.push("/onboarding/1");
    }
  }, [isSuccess, user, router]);

  useEffect(() => {
    if (error) triggerToast(error.message);
  }, [error]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
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

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              showError={!!errors.password}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <div className="mt-4">
          <SquareButton
            type="submit"
            variant="red"
            size="lg"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </SquareButton>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-grey-normalActive">
          <Checkbox
            id="remember-me"
            label="로그인 상태 유지"
            {...register("rememberMe")}
          />
          <div className="flex items-center gap-2">
            <Link href="/forgot-password" className="hover:underline">
              비밀번호 찾기
            </Link>
            <span className="text-grey-normalActive">|</span>
            <Link href="/sign-up" className="hover:underline">
              회원가입
            </Link>
          </div>
        </div>
      </form>

      <Toast message={toastMessage} show={showToast} className="bottom-36" />
    </>
  );
}
