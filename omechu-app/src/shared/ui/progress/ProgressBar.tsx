//! 26.01.06 작업

import { cva } from "class-variance-authority";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

const containerStyle = cva("flex justify-center w-full px-5", {
  variants: {},
});

const segmentStyle = cva("h-[9px] rounded-[30px] border border-brand-primary", {
  variants: {
    filled: {
      true: "bg-brand-primary border",
      false: "bg-brand-secondary",
    },
  },
});

export function ProgressBar({
  currentStep,
  totalSteps,
  className,
}: ProgressBarProps) {
  return (
    <div
      className={twMerge(
        "flex w-full justify-center gap-1.5 py-2.5",
        containerStyle(),
        className,
      )}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            "flex-1",
            segmentStyle({ filled: index < currentStep }),
          )}
        />
      ))}
    </div>
  );
}
