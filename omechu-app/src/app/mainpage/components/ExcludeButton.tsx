"use client";

import Image from "next/image";

type Props = {
  onClick: () => void;
};

export default function ExcludeButton({ onClick }: Props) {
  return (
    <button
      className="absolute top-1 left-2 z-10 bg-white rounded-full"
      onClick={onClick}
    >
      <Image
        src="/do_not_disturb_on.png"
        alt="제외 아이콘"
        width={24}
        height={24}
      />
    </button>
  );
}
