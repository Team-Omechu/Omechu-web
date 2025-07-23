"use client";

import Image from "next/image";

type Props = {
  onClick: () => void;
};

export default function ExcludeButton({ onClick }: Props) {
  return (
    <button
      className="absolute left-2 z-10 rounded-full bg-white"
      onClick={onClick}
    >
      <Image
        src="/circle/circle_minus.svg"
        alt="제외 아이콘"
        width={24}
        height={24}
      />
    </button>
  );
}
