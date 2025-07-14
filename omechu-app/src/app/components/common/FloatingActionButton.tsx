"use client";

import Image from "next/image";

type FloatingActionButtonProps = {
  onClick: () => void;
  alt?: string;
};

export default function FloatingActionButton({
  onClick,
  alt = "floating-button",
}: FloatingActionButtonProps) {
  return (
    <section className="fixed z-10 transform -translate-x-1/2 bottom-4 left-1/2">
      <button onClick={onClick}>
        <Image
          src="/components/common/fab.svg"
          alt={alt}
          width={36}
          height={36}
        />
      </button>
    </section>
  );
}
