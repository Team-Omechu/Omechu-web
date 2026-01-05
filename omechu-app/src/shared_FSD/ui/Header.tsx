"use client";

import Image from "next/image";

import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

const headerStyles = cva(
  clsx(
    "flex items-center px-5 py-2.5 mt-2",
    "w-full h-12",
    "text-body-3-medium text-font-high",
  ),
);

type HeaderStyleProps = VariantProps<typeof headerStyles>;

type HeaderProps = {
  title?: React.ReactNode;
  leftChild?: React.ReactNode;
  isRightChild?: boolean;
  className?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
} & HeaderStyleProps;

export const Header = ({
  title,
  leftChild,
  isRightChild = false,
  onLeftClick,
  onRightClick,
  className,
}: HeaderProps) => {
  return (
    <header className={clsx(headerStyles(), className)}>
      <button
        type="button"
        onClick={onLeftClick}
        className={clsx("flex justify-start gap-2", title ? "w-1/6" : "w-2/6")}
      >
        <Image
          src="/arrow/left-header-arrow.svg"
          alt=""
          width={24}
          height={24}
        />
        {leftChild}
      </button>
      {title ? (
        <div className="line-clamp-2 flex w-4/6 justify-center text-center">
          {title}
        </div>
      ) : (
        <div className="flex w-2/6" />
      )}
      {isRightChild && (
        <button
          type="button"
          onClick={onRightClick}
          className={clsx("flex justify-end", title ? "w-1/5" : "w-2/5")}
        >
          <Image src="/x/black_x_icon.svg" alt="" width={24} height={24} />
        </button>
      )}
    </header>
  );
};
