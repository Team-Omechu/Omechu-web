"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { fetchProfile } from "@/mypage/api/profile";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import Checkbox from "@/auth/components/Checkbox";
import SquareButton from "@/components/common/button/SquareButton";
import Input from "@/components/common/Input";
import Toast from "@/components/common/Toast";
import { useAuthStore } from "@/lib/stores/auth.store";
import { loginSchema, LoginFormValues } from "@/auth/schemas/auth.schema";
import { useLoginMutation } from "@/lib/hooks/useAuth";
import { ApiClientError } from "@/lib/api/auth";

export default function SignInForm() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimerRef = useRef<number | null>(null);
  const navigatedRef = useRef(false);
  const justLoggedInRef = useRef(false);

  const router = useRouter();
  const queryClient = useQueryClient();

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
      justLoggedInRef.current = false;
      navigatedRef.current = false;
    };
  }, []);

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: async (res) => {
        try {
          // 로그인 응답: { resultType, success: { userId, accessToken, refreshToken } }
          const userKey = res?.success?.userId ?? "me";

          // (1) 캐시에 최소 프로필 시드 → /mypage 최초 진입 즉시 렌더 방지
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

          // (2) 백그라운드에서 실제 프로필 동기화 (200/304)
          await queryClient.prefetchQuery({
            queryKey: ["profile", userKey],
            queryFn: fetchProfile,
          });

          // (3) 최신화 트리거(시드 유지) → /mypage 진입 시 최신값으로 교체
          queryClient.invalidateQueries({
            queryKey: ["profile"],
            exact: false,
          });
          justLoggedInRef.current = true;
        } catch (e) {
          // prefetch 실패해도 로그인 플로우는 계속 진행
          console.warn("[SignIn] prefetch profile failed", e);
        }
      },
    });
  };

  // 로그인 응답은 토큰 중심으로 처리되고, 최종 유저 정보는 전역에서 /profile 동기화된다고 가정
  const user = useAuthStore((s) => s.user);

  // 최종 유저 프로필 동기화 완료 후 라우팅 (중복 이동 방지)
  useEffect(() => {
    // 이 폼 인스턴스에서 막 로그인한 경우에만 라우팅 수행
    if (navigatedRef.current) return;
    if (!justLoggedInRef.current) return;
    if (!isSuccess || !user?.email) return;

    if (process.env.NODE_ENV !== "production") {
      console.log("[SignIn] navigate after login:", {
        email: user.email,
        nickname: user.nickname,
      });
    }

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
    // 1) 서버에서 내려준 reason을 최우선으로 노출
    let msg: string | null = e?.message || null;
    // 2) 보조 메시지: 특정 코드만 보완
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

      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </>
  );
}
