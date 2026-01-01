import * as React from "react";

import Image from "next/image";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const inputStyles = cva(
  [
    "w-full h-12 px-4",
    "rounded-[10px] border border-font-placeholder outline-none",
    "bg-background-secondary",
    "placeholder:text-font-placeholder",
    "transition-colors flex items-center",
  ],
  {
    variants: {
      width: {
        default: "w-[335px]",
        verify: "w-[210px]",
      },
      state: {
        default: "",
        error: "border-color-status-warning",
      },
    },
    defaultVariants: {
      width: "default",
      state: "default",
    },
  },
);

type BaseInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputStyles>;

const PasswordInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, width, state, disabled, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => {
      setIsVisible((v) => !v);
    };

    return (
      <div className={clsx(inputStyles({ width, state }), className)}>
        <input
          ref={ref}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          className="placeholder:text-font-placeholder flex-1 bg-transparent outline-none"
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="flex items-center pl-4"
          aria-label="비밀번호 보기 전환"
        >
          {isVisible ? (
            <Image
              src="/eye/eye_open.svg"
              alt="비밀번호 보임"
              width={24}
              height={24}
            />
          ) : (
            <Image
              src="/eye/eye_closed.svg"
              alt="비밀번호 숨김"
              width={24}
              height={24}
            />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export const Input = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ type, ...props }, ref) => {
    if (type === "password") {
      return <PasswordInput ref={ref} {...props} />;
    }

    return (
      <input
        ref={ref}
        type={type}
        disabled={props.disabled}
        className={clsx(
          inputStyles({ width: props.width, state: props.state }),
          props.className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
