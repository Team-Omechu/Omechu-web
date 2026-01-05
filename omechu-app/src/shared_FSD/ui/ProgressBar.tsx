import { cva } from "class-variance-authority";
import clsx from "clsx";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

const containerStyle = cva("flex justify-center w-[375px] px-5", {
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

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className={containerStyle()}>
      <div className="flex w-full justify-center gap-1.5 py-2.5">
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
    </div>
  );
}
