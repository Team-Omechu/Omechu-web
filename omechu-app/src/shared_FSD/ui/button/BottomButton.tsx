import React from "react";

import { cva, VariantProps } from "class-variance-authority";

const bottomButtonStyles = cva(
  "w-full h-[50px] rounded-t-[16px] text-brand-secondary text-body-4-regular flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-statelayer-default)]",
        pressed: "bg-[var(--color-statelayer-pressed)]",
        disabled: "bg-[var(--color-statelayer-disabled)]",
      },
    },
    defaultVariants: {
      variant: "disabled",
    },
  },
);

type BottomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof bottomButtonStyles>;

export const BottomButton = ({
  variant,
  children,
  onClick,
  ...props
}: BottomButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={bottomButtonStyles({ variant })}
      {...props}
    >
      {children}
    </button>
  );
};
