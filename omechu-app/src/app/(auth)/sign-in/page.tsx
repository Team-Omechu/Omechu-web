import Link from "next/link";

import { AuthButton } from "@/shared";

/**
 * 소셜 로그인 메인 페이지
 * - 카카오, 구글 소셜 로그인 버튼
 * - 이메일 로그인/회원가입 링크
 */
export default function SignInPage() {
  return (
    <div className="flex flex-col items-center">
      {/* 로그인 버튼 영역 */}
      <div className="mt-20 flex w-80 flex-col gap-6">
        {/* 카카오 로그인 */}
        <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`}>
          <AuthButton
            variant="kakao"
            icon="/kakao/kakao.svg"
            iconAlt="카카오 아이콘"
            type="button"
          >
            카카오 로그인
          </AuthButton>
        </a>

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
      </div>

      {/* 이메일 로그인 / 회원가입 링크 */}
      <div className="mt-10 flex items-center gap-3 text-caption-1-regular">
        <Link href="/sign-in/email" className="text-font-medium hover:underline">
          이메일 로그인
        </Link>
        <span className="text-caption-2-medium text-font-placeholder">ㅣ</span>
        <Link href="/sign-up" className="text-font-medium hover:underline">
          이메일 회원가입
        </Link>
      </div>
    </div>
  );
}
