//! 26.01.04 작업 완료

import React from "react";

import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

const buttonStyles = cva(
  clsx(
    // 모양
    "h-12",
    "rounded-[10px]",
    "flex items-center justify-center",

    // 타이포그래피
    // "text-brand-secondary",

    // 인터랙션
    "active:bg-statelayer-pressed",
    "disabled:bg-statelayer-disabled disabled:cursor-not-allowed disabled:active:bg-statelayer-disabled",
  ),
  {
    variants: {
      fontColor: {
        default: "text-brand-secondary",
        black: "text-font-medium active:text-brand-secondary",
      },
      bgColor: {
        default: "bg-statelayer-default",
        white: "bg-[#F6F6F6] border border-font-disabled",
        grey: "bg-brand-tertiary",
      },
      width: {
        xl: "w-[335px] text-body-4-regular",
        md: "w-[160px] text-body-3-regular",
        sm: "w-[116px] text-caption-1-regular",
      },
    },
    defaultVariants: {
      fontColor: "default",
      bgColor: "default",
      width: "xl",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export const Button = ({
  fontColor,
  bgColor,
  width,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={buttonStyles({ fontColor, bgColor, width })}
      {...props}
    >
      {children}
    </button>
  );
};
