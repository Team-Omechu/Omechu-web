"use client";

import React, { forwardRef } from "react";

import Image from "next/image";

type CheckboxProps = {
  label: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, ...props }, ref) => {
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center">
        <div className="relative h-[17px] w-[17px]">
          <input
            type="checkbox"
            id={id}
            ref={ref}
            {...props}
            // 실제 input은 숨기고, 상태 관리에만 사용합니다.
            className="peer absolute h-full w-full opacity-0"
          />
          {/* Unchecked 상태 (기본으로 보임) */}
          <Image
            src="/auth/unchecked.svg"
            alt="unchecked"
            width={17}
            height={17}
            className="peer-checked:hidden"
          />
          {/* Checked 상태 (체크됐을 때만 보임) */}
          <Image
            src="/auth/checked.svg"
            alt="checked"
            width={17}
            height={17}
            className="hidden peer-checked:block"
          />
        </div>
        <span className="ml-2 text-sm">{label}</span>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox; 