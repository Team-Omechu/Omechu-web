"use client";

import React from "react";

type StepFooterProps = {
  showPrev?: boolean;
  showNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  children?: React.ReactNode;
};

export const StepFooter = ({
  showPrev = false,
  showNext = false,
  onPrev,
  onNext,
  children,
}: StepFooterProps) => {
  // 표시할 버튼이나 컨텐츠가 없으면 footer 자체를 렌더링하지 않습니다.
  if (!showPrev && !showNext && !children) {
    return null;
  }

  return (
    <footer className="w-full pb-[env(safe-area-inset-bottom)]">
      {(showPrev || showNext) && (
        <div className="mb-3 flex justify-between px-5">
          {showPrev ? (
            <button
              onClick={onPrev}
              className="text-grey-normal-active text-base"
            >
              {"<"} 이전으로
            </button>
          ) : (
            <div />
          )}
          {showNext ? (
            <button
              onClick={onNext}
              className="text-grey-normal-active text-base"
            >
              건너뛰기 {">"}
            </button>
          ) : null}
        </div>
      )}
      {children}
    </footer>
  );
};
