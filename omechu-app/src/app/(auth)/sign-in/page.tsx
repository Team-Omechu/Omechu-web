import Image from "next/image";
import Link from "next/link";

import { AuthButton } from "@/shared";

/**
 * 소셜 로그인 메인 페이지
 * - 카카오, 구글 소셜 로그인 버튼
 * - 이메일 로그인 링크
 */
export default function SignInPage() {
  return (
    <main className="flex flex-1 flex-col bg-background-primary">
      {/* 상단 로고 영역 */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <Image
          src="/logo/logo.png"
          alt="Omechu Logo"
          width={139}
          height={92}
          priority
        />
        <p className="text-body-4-regular text-font-medium mt-4">
          3초만에 간편 로그인
        </p>
      </div>

      {/* 하단 로그인 버튼 영역 */}
      <div className="flex flex-col gap-3 px-5 pb-10">
        {/* 구글 로그인 */}
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
          <AuthButton
            variant="google"
            icon="/google/google.svg"
            iconAlt="구글 아이콘"
            type="button"
          >
            구글로 로그인
          </AuthButton>
        </a>

        {/* 카카오 로그인 */}
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`}>
          <AuthButton
            variant="kakao"
            icon="/kakao/kakao.svg"
            iconAlt="카카오 아이콘"
            type="button"
          >
            카카오로 로그인
          </AuthButton>
        </a>

        {/* 이메일 로그인 / 회원가입 링크 */}
        <div className="text-body-4-regular mt-4 flex items-center justify-center gap-2">
          <Link
            href="/sign-in/email"
            className="text-font-medium hover:underline"
          >
            이메일로 로그인
          </Link>
          <span className="text-font-placeholder">|</span>
          <Link href="/sign-up" className="text-font-medium hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}
