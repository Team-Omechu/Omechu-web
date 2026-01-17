// -------------------------------------------
// [공용 컴포넌트] FloatingActionButton 사용법
// -------------------------------------------
// - 페이지 컴포넌트 안에서 // *  mainRef: useRef<HTMLDivElement>(null) 생성
// - // * scrollToTop(): mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })
// - <main ref={mainRef}> ... </main> 안쪽에 이 컴포넌트 넣기 // * 꼭 main이 아닌, 본문이 되는 가장 상위 태그에 ref={mainRef}
// - onClick에는 // *scrollToTop 함수 전달
// - alt는 선택 (기본값: "floating-button")
// - //* 아이콘 경로는 "/components/common/fab.svg" 기준으로 고정
// -------------------------------------------

"use client";

import Image from "next/image";

import { cn } from "@/shared/lib/cn.util";

type FloatingActionButtonProps = {
  onClick: () => void; // 클릭 시 실행할 함수 (예: scrollToTop)
  className?: string; // 페이지별로 컴포넌트 위치 설정 (예: bottom-24)
  alt?: string; // 이미지 대체 텍스트 (기본값: "floating-button")
};

export function FloatingActionButton({
  onClick,
  className,
  alt = "floating-button",
}: FloatingActionButtonProps) {
  return (
    <section
      className={cn("fixed right-4 z-10 -translate-x-1/2 transform", className)}
    >
      <button onClick={onClick}>
        <Image
          src="/common/floatingActionButton.svg"
          alt={alt}
          width={36}
          height={36}
        />
      </button>
    </section>
  );
}
