"use client";

import Image from "next/image";
import { useState } from "react";

interface InputProps {
  label: string;
  value: string;
  type?: "text" | "password" | "email"; // 기본은 text, password일 경우 eye 아이콘 표시
  placeholder?: string;
  showButton?: boolean;
  buttonText?: string;
  errorMessage?: string;
  showError?: boolean;
  description?: string;
  onClick?: () => void;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  value,
  type = "text",
  placeholder = "",
  showButton = true,
  buttonText,
  errorMessage,
  showError = false,
  description = "",
  onClick,
  onChange,
  onBlur,
  onKeyDown,
}: InputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (isVisible ? "text" : "password") : type;

  return (
    <section className="relative flex flex-col w-full mb-5">
      <span className="ml-1">{label}</span>
      <div className="flex items-center">
        <input
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={`w-full h-10 
                      text-sm text-[#828282] font-normal text-center 
                      border-[1px] border-[#626262] rounded-md
                      
                      `}
        />
        {/* 버튼 표시 여부 */}
        {showButton && (
          <button
            onClick={onClick}
            className="absolute right-2 pl- flex-shrink-0 px-3 pt-1 w-fit h-7 text-center text-xs text-white bg-[#1F9BDA] rounded-lg "
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* 비밀번호 보기 아이콘 (type이 password일 때만 렌더링) */}
      {isPassword && (
        <Image
          className="absolute cursor-pointer top-8 right-4 active:bg-gray-200"
          onClick={() => setIsVisible((prev) => !prev)}
          src={
            isVisible
              ? "/components/common/eye_open.svg"
              : "/components/common/eye_closed.svg"
          }
          alt="비밀번호 보기 토글"
          width={24}
          height={24}
        />
      )}
      {/* input 하단 메세지 */}
      <span className="mt-1 ml-1 text-sm font-normal text-[#828282]">
        {description}
      </span>

      {/* 에러 메시지 */}
      {showError && errorMessage && (
        <span className="text-xs font-normal text-red-500">{errorMessage}</span>
      )}
    </section>
  );
}
