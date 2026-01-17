"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Header } from "@/shared/ui/header/Header";

/**
 * 로그인 관련 페이지 레이아웃
 * - 뒤로가기 헤더
 * - 로고 고정 위치
 * - 컨텐츠 중앙 정렬
 */
export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <>
      <Header onLeftClick={() => router.back()} />

      {/* 로고 - 고정 위치 */}
      <div className="mt-12 flex justify-center">
        <Image
          src="/logo/logo.png"
          alt="Omechu Logo"
          width={139}
          height={92}
          priority
        />
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex flex-1 flex-col items-center">
        {children}
      </div>
    </>
  );
}
