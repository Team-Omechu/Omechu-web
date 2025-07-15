import React, { forwardRef } from 'react';

type InputProps = {
  label?: string;
  error?: string;
  subText?: string;
  rightAddon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, name, type, error, subText, rightAddon, className, ...props },
    ref,
  ) => {
    // 기본 스타일 (플레이스홀더는 회색, 입력 텍스트는 검정)
    const baseStyle =
      'w-full h-12 px-4 border rounded-md focus:outline-none bg-white placeholder:text-[#828282] text-black text-sm placeholder:text-center';
    const normalStyle = 'border-[#D9D9D9] focus:border-black';
    const errorStyle = 'border-red-500 focus:border-red-500';

    const inputClassName = `${baseStyle} ${
      error ? errorStyle : normalStyle
    } ${className || ''}`;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={name}
            className="text-base font-medium text-[#393939]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={name}
            name={name}
            type={type}
            ref={ref}
            {...props}
            className={inputClassName}
          />
          {/* 오른쪽 추가 기능 (버튼 등) */}
          {rightAddon && (
            <div className="absolute right-0 flex h-full items-center pr-2">
              {rightAddon}
            </div>
          )}
        </div>
        {/* 에러 메시지 또는 보조 텍스트 */}
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : subText ? (
          <p className="text-xs text-[#828282]">{subText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
