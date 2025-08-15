"use client";

import Image from "next/image";
import Link from "next/link";

import SignInForm from "./components/SignInForm";

export default function SignInPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 py-10">
        <Link href="/">
          <Image
            src="/logo/logo.png"
            alt="Omechu Logo"
            width={139}
            height={92}
            priority
          />
        </Link>

        <SignInForm />

        <div className="relative flex w-full items-center">
          <hr className="w-full border-t border-grey-darkHover" />
          <span className="absolute left-1/2 -translate-x-1/2 bg-main-normal px-2 text-xs text-gray-400">
            or
          </span>
        </div>

        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-md bg-[#FEE500] p-2 text-lg font-medium text-[#393939] transition-colors hover:bg-[#f3da00] active:bg-[#e0c900]"
        >
          <Image
            src="/kakao/kakao.svg"
            alt="카카오 아이콘"
            width={24}
            height={24}
          />
          카카오 로그인
        </a>
      </div>
    </main>
  );
}
