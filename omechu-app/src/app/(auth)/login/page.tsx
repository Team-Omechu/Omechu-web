"use client";

import Link from "next/link";

import { useGoogleLogin, useKakaoLogin } from "@/entities/user";
import { AuthButton } from "@/shared";
import { Toast, useToast } from "@/shared";

/**
 * 소셜 로그인 메인 페이지
 * - 카카오, 구글 SDK 기반 소셜 로그인 버튼
 * - 이메일 로그인/회원가입 링크
 */
export default function SignInPage() {
  const { initiateKakaoLogin, isLoading: kakaoLoading } = useKakaoLogin();
  const { handleGoogleLogin, isLoading: googleLoading } = useGoogleLogin();
  const { show, message } = useToast();

  return (
    <div className="flex flex-col items-center">
      {/* 로그인 버튼 영역 */}
      <div className="mt-20 flex w-80 flex-col gap-6">
        {/* 카카오 로그인 */}
        <AuthButton
          variant="kakao"
          icon="/kakao/kakao.svg"
          iconAlt="카카오 아이콘"
          type="button"
          onClick={initiateKakaoLogin}
          isLoading={kakaoLoading}
          disabled={kakaoLoading || googleLoading}
        >
          카카오 로그인
        </AuthButton>

        {/* 구글 로그인 */}
        <AuthButton
          variant="google"
          icon="/google/google.svg"
          iconAlt="구글 아이콘"
          type="button"
          onClick={handleGoogleLogin}
          isLoading={googleLoading}
          disabled={kakaoLoading || googleLoading}
        >
          구글로 로그인
        </AuthButton>
      </div>

      {/* 이메일 로그인 / 회원가입 링크 */}
      <div className="text-caption-1-regular mt-10 flex items-center gap-3">
        <Link
          href="/login/email"
          className="text-font-medium hover:underline"
        >
          이메일 로그인
        </Link>
        <span className="text-caption-2-medium text-font-placeholder">ㅣ</span>
        <Link href="/signup" className="text-font-medium hover:underline">
          이메일 회원가입
        </Link>
      </div>

      <Toast message={message} show={show} />
    </div>
  );
}
