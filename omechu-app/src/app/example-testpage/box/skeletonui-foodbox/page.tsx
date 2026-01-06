"use client";

import { SkeletonUIFoodBox } from "@/shared_FSD/ui/box/SkeletonUIFoodBox";

export default function SkeletonUIFoodBoxTestPage() {
  return (
    <main
      role="main"
      className="flex min-h-screen items-center justify-center p-6"
      aria-label="스켈레톤 UI 테스트 페이지"
    >
      <section
        role="status"
        aria-busy="true"
        className="flex flex-col items-center gap-4"
        aria-label="로딩 UI 미리보기"
      >
        <h1 className="text-body-4-medium">
          SkeletonUIFoodBox 컴포넌트 테스트
        </h1>

        {/* 단독 컴포넌트 검증 */}
        <SkeletonUIFoodBox />

        {/* 여러 개 렌더링 검증 */}
        <div
          role="list"
          className="mt-6 flex flex-wrap justify-center gap-3"
          aria-label="다중 스켈레톤 카드"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} role="listitem">
              <SkeletonUIFoodBox />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
