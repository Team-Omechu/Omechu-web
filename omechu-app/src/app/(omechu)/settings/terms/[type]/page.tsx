"use client";

import { useRef } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { notFound } from "next/navigation";

import {
  FloatingActionButton,
  Header,
  TermsContent,
  TERMS_CONFIG,
  isValidTermsType,
} from "@/shared";

/**
 * 약관 상세 페이지 (동적 라우팅)
 * - URL: /settings/terms/[type]
 * - type: service | personal-info | location-info
 */
export default function TermsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const mainRef = useRef<HTMLDivElement>(null);

  // URL 파라미터에서 타입 추출
  const type = params.type as string;

  // 유효하지 않은 타입이면 404
  if (!isValidTermsType(type)) {
    notFound();
  }

  const config = TERMS_CONFIG[type];

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        title={config.title}
        leftChild={
          <button onClick={() => router.back()} aria-label="뒤로가기">
            <Image
              src="/arrow/left-header-arrow.svg"
              alt="뒤로가기"
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main
        ref={mainRef}
        className="scrollbar-hide relative h-[calc(100dvh-3rem)] w-full overflow-x-hidden overflow-y-auto px-7 py-9"
      >
        <TermsContent data={config.data} />
        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />
      </main>
    </>
  );
}
