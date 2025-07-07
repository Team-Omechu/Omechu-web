// src/components/common/SearchBar.tsx

"use client";

import Image from "next/image";
import { ChangeEvent, KeyboardEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClickIcon?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onKeyDown,
  onClickIcon,
  placeholder = "검색어를 입력하세요.",
}: SearchBarProps) {
  return (
    <section className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="px-6 flex items-center bg-white w-[340px] h-10 border-2 border-black rounded-3xl"
      />
      <Image
        onClick={onClickIcon}
        className="absolute z-10 top-1.5 right-4 cursor-pointer"
        src="/search.png"
        alt="검색"
        width={25}
        height={25}
      />
    </section>
  );
}
