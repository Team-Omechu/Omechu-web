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
    "text-brand-secondary",

    // 인터랙션
    "active:bg-statelayer-pressed",
    "disabled:bg-statelayer-disabled disabled:cursor-not-allowed disabled:active:bg-statelayer-disabled",
  ),
  {
    variants: {
      variant: {
        default: "bg-statelayer-default",
      },
      width: {
        default: "w-[335px] text-body-4-regular",
        verify: "w-[116px] text-caption-1-regular",
      },
    },
    defaultVariants: {
      variant: "default",
      width: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export const Button = ({ variant, width, children, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={buttonStyles({ variant, width })}
      {...props}
    >
      {children}
    </button>
  );
};
