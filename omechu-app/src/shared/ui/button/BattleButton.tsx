//! 26.01.06 작업 완료

import React from "react";

import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

const battleButtonStyles = cva(
  clsx(
    // 모양
    "h-12",
    "rounded-[10px]",
    "flex items-center justify-center",

    // 인터랙션
    "active:bg-statelayer-pressed active:text-brand-secondary",
    "disabled:bg-statelayer-disabled disabled:cursor-not-allowed disabled:active:bg-statelayer-disabled",
  ),
  {
    variants: {
      fontColor: {
        default: "text-brand-secondary",
        grey: "text-font-medium",
      },
      bgColor: {
        default: "bg-statelayer-default",
        grey: "bg-brand-tertiary",
      },
      width: {
        xl: "w-2xs text-body-4-medium",
        md: "w-[180px] text-body-4-medium",
        sm: "w-36 text-body-4-medium",
        xs: "w-[140px] text-body-2",
      },
    },
    defaultVariants: {
      fontColor: "default",
      bgColor: "default",
      width: "xl",
    },
  },
);

type BattleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof battleButtonStyles>;

export const BattleButton = ({
  fontColor,
  bgColor,
  width,
  children,
  ...props
}: BattleButtonProps) => {
  return (
    <button
      type="button"
      className={battleButtonStyles({ fontColor, bgColor, width })}
      {...props}
    >
      {children}
    </button>
  );
};
