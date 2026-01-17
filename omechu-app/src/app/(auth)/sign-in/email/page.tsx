"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

import { ApiClientError } from "@/entities/user/api/authApi";
import { fetchProfile } from "@/entities/user/api/profileApi";
import { useLoginMutation } from "@/entities/user/lib/hooks/useAuth";
import {
  loginSchema,
  LoginFormValues,
} from "@/entities/user/model/auth.schema";
import { useAuthStore } from "@/entities/user/model/auth.store";
import { Button, FormField, Input, Toast, useToast } from "@/shared";

/**
 * 이메일 로그인 페이지
 * - 이메일/비밀번호 입력 폼
 * - 로그인 상태 유지 체크박스
 * - 비밀번호 찾기 / 회원가입 링크
 */
export default function EmailSignInPage() {
  const [rememberMe, setRememberMe] = useState(true);
  const navigatedRef = useRef(false);
  const justLoggedInRef = useRef(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { show: showToast, message: toastMessage, triggerToast } = useToast();

  const { mutate: login, isPending, isSuccess, error } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    (data: LoginFormValues) => {
      login(data, {
        onSuccess: async (res) => {
          try {
            const userKey = res?.success?.userId ?? "me";

            queryClient.setQueryData(["profile", userKey], {
              id: isNaN(Number(userKey)) ? 0 : Number(userKey),
              email: "",
              nickname: "-",
              gender: "",
              bodyType: "",
              exercise: "",
              prefer: [],
              allergy: [],
              profileImageUrl: null,
              createdAt: "",
              updatedAt: "",
            });

            await queryClient.prefetchQuery({
              queryKey: ["profile", userKey],
              queryFn: fetchProfile,
            });

            queryClient.invalidateQueries({
              queryKey: ["profile"],
              exact: false,
            });
            justLoggedInRef.current = true;
          } catch (e) {
            console.warn("[EmailSignIn] prefetch profile failed", e);
          }
        },
      });
    },
    [login, queryClient],
  );

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (navigatedRef.current) return;
    if (!justLoggedInRef.current) return;
    if (!isSuccess || !user?.email) return;

    navigatedRef.current = true;
    if (user.nickname && user.nickname.trim().length > 0) {
      router.push("/mainpage");
    } else {
      router.push("/onboarding/1");
    }
  }, [isSuccess, user, router]);

  useEffect(() => {
    if (!error) return;
    const e = error as ApiClientError & { code?: string; status?: number };
    const code = e?.code;
    let msg: string | null = e?.message || null;

    if (!msg) {
      switch (code) {
        case "C001":
          msg = "이메일 또는 비밀번호를 입력해 주세요.";
          break;
        case "C003":
          msg = "로그인이 필요합니다. 다시 시도해 주세요.";
          break;
        case "S001":
          msg = "세션이 만료되었어요. 다시 로그인해 주세요.";
          break;
        case "T002":
        case "T003":
          msg = "인증에 문제가 발생했어요. 다시 로그인해 주세요.";
          break;
        default:
          msg = null;
      }
    }
    triggerToast(msg || "로그인에 실패했습니다.");
  }, [error, triggerToast]);

  // eslint-disable-next-line react-hooks/refs -- handleSubmit is from react-hook-form
  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <div className="flex w-full flex-col items-center">
      {/* 로그인 폼 */}
      <form onSubmit={handleFormSubmit} className="mt-14 flex w-full flex-col gap-5 px-5">
        {/* 입력 필드 + 체크박스 + 버튼 영역 */}
        <div className="flex flex-col gap-3">
          {/* 입력 필드들 */}
          <div className="flex flex-col gap-2.5">
            {/* 이메일 */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <FormField
                  label="이메일"
                  id="email"
                  helperText={errors.email?.message}
                  helperState={errors.email ? "error" : undefined}
                >
                  <Input
                    type="email"
                    placeholder="이메일을 입력해주세요"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="w-full"
                  />
                </FormField>
              )}
            />

            {/* 비밀번호 */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <FormField
                  label="비밀번호"
                  id="password"
                  helperText={errors.password?.message || "* 대소문자, 숫자 및 특수문자 포함 8자 이상"}
                  helperState={errors.password ? "error" : undefined}
                >
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="w-full"
                  />
                </FormField>
              )}
            />

            {/* 로그인 상태 유지 체크박스 */}
            <label className="flex cursor-pointer items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex size-5 items-center justify-center rounded-sm border-[0.5px] border-font-high bg-background-secondary"
              >
                {rememberMe && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1 5L4.5 8.5L11 1"
                      stroke="#242424"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span className="text-caption-1-regular text-font-high">
                로그인 상태 유지
              </span>
            </label>
          </div>

          {/* 로그인 버튼 */}
          <Button type="submit" disabled={isPending} className="h-12 w-full">
            {isPending ? "로그인 중..." : "로그인"}
          </Button>
        </div>

        {/* 비밀번호 찾기 / 회원가입 링크 */}
        <div className="flex items-center justify-center gap-1 text-caption-1-regular">
          <Link href="/forgot-password" className="text-font-medium">
            비밀번호 찾기
          </Link>
          <span className="text-font-placeholder">|</span>
          <Link href="/sign-up" className="text-font-medium">
            회원가입
          </Link>
        </div>
      </form>

      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </div>
  );
}
