"use client";

import React, { forwardRef } from "react";

import Image from "next/image";

type CheckboxProps = {
  label: React.ReactNode;
  variant?: "square" | "round";
} & React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, variant = "square", ...props }, ref) => {
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center">
        <div className="relative h-[17px] w-[17px]">
          <input
            type="checkbox"
            id={id}
            ref={ref}
            {...props}
            className="peer absolute h-full w-full cursor-pointer opacity-0"
          />

          {variant === "round" ? (
            <>
              {/* Round Unchecked */}
              <Image
                src="/auth/unchecked-round.svg"
                alt="unchecked"
                width={17}
                height={17}
                className="peer-checked:hidden"
              />
              {/* Round Checked */}
              <Image
                src="/auth/checked-round.svg"
                alt="checked"
                width={17}
                height={17}
                className="hidden peer-checked:block"
              />
            </>
          ) : (
            <>
              {/* Square Unchecked */}
              <Image
                src="/auth/unchecked-square.svg"
                alt="unchecked"
                width={17}
                height={17}
                className="peer-checked:hidden"
              />
              {/* Square Checked */}
              <Image
                src="/auth/checked-square.svg"
                alt="checked"
                width={17}
                height={17}
                className="hidden peer-checked:block"
              />
            </>
          )}
        </div>
        <span className="ml-2 text-sm">{label}</span>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
