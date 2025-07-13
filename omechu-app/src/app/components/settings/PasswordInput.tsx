"use client";

import Image from "next/image";
import { useState } from "react";

interface PasswordInputProps {
  label: string;
  value: string;
  placeholder?: string;
  errorMessage?: string;
  onChange: (value: string) => void;
  showError?: boolean;
  testId?: string;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({
  label,
  value,
  placeholder = "",
  errorMessage,
  showError = false,
  testId,
  onChange,
  onBlur,
  onKeyDown,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section className="relative flex flex-col w-full gap-1 mb-5">
      <span>{label}</span>
      <input
        data-testid={testId}
        type={isVisible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="w-full h-10 text-sm text-[#828282] font-normal text-center border-[1px] border-[#626262] rounded-md"
      />
      <Image
        className="absolute top-9 right-4 active:bg-gray-200"
        onClick={() => setIsVisible((prev) => !prev)}
        src={isVisible ? "/eye_open.svg" : "/eye_closed.svg"}
        alt="비밀번호 보기 토글"
        width={24}
        height={24}
      />
      {showError && errorMessage && (
        <span className="text-xs font-normal text-red-500">{errorMessage}</span>
      )}
    </section>
  );
}
