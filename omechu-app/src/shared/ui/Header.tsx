//! 26.01.05 작업 완료

"use client";

import type { ReactNode } from "react";

import Image from "next/image";

import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

const headerStyles = cva(
  clsx(
    "flex items-center px-5 py-2.5 my-2",
    "w-full h-12",
    "text-body-3-medium text-font-high",
  ),
);

type HeaderStyleProps = VariantProps<typeof headerStyles>;

type HeaderProps = {
  title?: ReactNode;
  leftChild?: ReactNode;
  rightChild?: ReactNode;
  className?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
} & HeaderStyleProps;

export const Header = ({
  title,
  leftChild,
  rightChild,

  onLeftClick,
  onRightClick,
  className,
}: HeaderProps) => {
  return (
    <header className={clsx(headerStyles(), "justify-between", className)}>
      <button
        type="button"
        onClick={onLeftClick}
        className="flex shrink-0 items-center justify-start gap-2"
      >
        <Image
          src="/arrow/left-header-arrow.svg"
          alt="뒤로가기"
          width={24}
          height={24}
        />
        {leftChild}
      </button>
      {title && (
        <div className="mx-2 line-clamp-2 flex-1 text-center">{title}</div>
      )}
      <button
        type="button"
        onClick={onRightClick}
        className="flex shrink-0 items-center justify-end"
      >
        {rightChild ?? (
          <Image src="/x/black_x_icon.svg" alt="닫기" width={24} height={24} />
        )}
      </button>
    </header>
  );
};
