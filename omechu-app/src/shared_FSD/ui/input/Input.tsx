"use client";
import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import {
  CloseEyeIcon,
  OpenEyeIcon,
} from "@/shared_FSD/assets/icons/ui/input/EyeIcon";
import { SearchIcon } from "@/shared_FSD/assets/icons/ui/input/SearchIcon";

const inputStyles = cva(
  [
    "flex items-center outline-none border border-font-placeholder",
    "bg-background-secondary text-font-high placeholder:text-font-placeholder",
    "px-4 transition-opacity duration-300",
  ],
  {
    variants: {
      width: {
        default: "w-[336px]",
        md: "w-[236px]",
        sm: "w-[210px]",
        xs: "w-[196px]",
      },
      height: {
        md: "h-12",
        sm: "h-10",
      },
      rounded: {
        sm: "rounded-[10px]",
        md: "rounded-[12px]",
      },
    },
    defaultVariants: {
      width: "default",
      height: "md",
      rounded: "sm",
    },
  },
);

type BaseInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputStyles> & {
    onSearch?: () => void;
  };

const PasswordInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, width, height, rounded, disabled, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible((v) => !v);

    return (
      <div
        className={twMerge(
          "relative",
          inputStyles({ width, height, rounded }),
          className,
        )}
      >
        <input
          ref={ref}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          autoComplete="off"
          className="flex-1 bg-transparent pr-6 outline-none"
          value={props.value}
          onChange={props.onChange}
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 flex items-center"
          aria-label="비밀번호 보기 전환"
        >
          {isVisible ? (
            <OpenEyeIcon className="w-6" />
          ) : (
            <CloseEyeIcon className="w-6" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

const SearchInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (
    { className, width, height, rounded, disabled, onSearch, ...props },
    ref,
  ) => {
    return (
      <div
        className={twMerge(
          "relative",
          inputStyles({ width, height, rounded }),
          className,
        )}
      >
        <input
          ref={ref}
          type="search"
          disabled={disabled}
          autoComplete="off"
          className="flex-1 bg-transparent pr-6 outline-none"
          value={props.value}
          onChange={props.onChange}
          {...props}
        />
        <button
          type="button"
          onClick={onSearch ?? (() => {})}
          className="absolute right-3 flex items-center"
          aria-label="검색 실행"
        >
          <SearchIcon className="w-5" />
        </button>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export const Input = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => {
    const { type = "text", ...rest } = props;
    if (type === "password") {
      return <PasswordInput ref={ref} {...rest} />;
    }
    if (type === "search") {
      return <SearchInput ref={ref} {...rest} />;
    }
    return (
      <input
        ref={ref}
        type={type === "number" ? "number" : type}
        disabled={props.disabled}
        autoComplete="off"
        value={props.value}
        onChange={props.onChange}
        className={twMerge(
          inputStyles({
            width: props.width,
            height: props.height,
            rounded: props.rounded,
          }),
          props.className,
        )}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
