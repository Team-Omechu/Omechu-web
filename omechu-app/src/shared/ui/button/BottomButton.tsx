// ! 26.01.04 작업 완료

import React from "react";

import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/cn.util";

const bottomButtonStyles = cva(
  [
    // 위치
    "fixed bottom-0  z-50",
    "min-w-108 h-[50px]",
    "rounded-t-[16px]",
    "flex items-center justify-center",

    // 타이포그래피
    "text-body-4-regular text-brand-secondary",

    // 인터랙션
    "active:bg-statelayer-pressed",
    "disabled:bg-statelayer-disabled disabled:cursor-not-allowed disabled:active:bg-statelayer-disabled",

    // iOS 대응
    "pb-[env(safe-area-inset-bottom)]",
  ],
  {
    variants: {
      variant: {
        default: "bg-statelayer-default",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BottomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof bottomButtonStyles>;

export const BottomButton = ({
  variant,
  className,
  children,
  ...props
}: BottomButtonProps) => {
  return (
    <button
      type="button"
      className={cn(bottomButtonStyles({ variant }), className)}
      {...props}
    >
      {children}
    </button>
  );
};
