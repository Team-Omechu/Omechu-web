"use client";

import React from "react";

type StepFooterProps = {
  showPrev?: boolean;
  showNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
};

const StepFooter = ({
  showPrev = false,
  showNext = false,
  onPrev,
  onNext,
}: StepFooterProps) => {
  return (
    <footer className="flex flex-col w-full pb-[env(safe-area-inset-bottom)] h-[66px] gap-3">
      <div className="flex justify-between">
        {showPrev ? (
          <button onClick={onPrev} className="ml-5 text-base text-[#828282]">
            {"<"} 이전으로
          </button>
        ) : (
          <div />
        )}
        {showNext ? (
          <button onClick={onNext} className="mr-5 text-base text-[#828282]">
            건너뛰기 {">"}
          </button>
        ) : null}
      </div>
    </footer>
  );
};

export default StepFooter;
