"use client";

import Image from "next/image";

type Props = {
  onClick: () => void;
};

export default function ExcludeButton({ onClick }: Props) {
  return (
    <button
      className="absolute left-2 top-1 z-10 rounded-full bg-white"
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
