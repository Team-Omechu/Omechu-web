// ! 26.01.06 작업 완료

"use client";

import * as React from "react";

import Image from "next/image";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const battelInputStyles = cva(
  [
    "flex items-center",
    "h-10 px-4",
    "bg-background-secondary",
    "rounded-xl border border-font-disabled outline-none",
    "text-font-high text-caption-1-regular",
    "placeholder:text-font-placeholder",
  ],
  {
    variants: {
      width: {
        default: "w-[335px]",
        md: "w-[235px]",
      },
    },
    defaultVariants: {
      width: "default",
    },
  },
);

type BaseInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof battelInputStyles> & { onSearch?: () => void };

const SearchInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, width, disabled, ...props }, ref) => {
    return (
      <div
        className={clsx("relative", battelInputStyles({ width }), className)}
      >
        <input
          ref={ref}
          type="search"
          disabled={disabled}
          autoComplete={"off"}
          className="placeholder:text-font-placeholder flex-1 bg-transparent outline-none"
          {...props}
        />
        <button
          type="button"
          onClick={props.onSearch ?? (() => {})}
          className="flex items-center pl-4"
          aria-label="검색 실행"
        >
          <Image src="/search/search.svg" alt="" width={24} height={24} />
        </button>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export const BattleInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ type, ...props }, ref) => {
    if (type === "search") {
      return <SearchInput ref={ref} onSearch={props.onSearch} {...props} />;
    }

    return (
      <input
        ref={ref}
        type={type}
        disabled={props.disabled}
        autoComplete={"off"}
        className={clsx(
          battelInputStyles({ width: props.width }),
          props.className,
        )}
        {...props}
      />
    );
  },
);

BattleInput.displayName = "BattleInput";
