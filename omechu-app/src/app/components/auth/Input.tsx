import React, { forwardRef } from "react";

type InputProps = {
  label?: string;
  error?: string;
  rightAddon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, type, error, rightAddon, ...props }, ref) => {
    const baseStyle =
      "w-full h-10 px-4 border rounded-md focus:outline-none bg-white placeholder:text-[13px] placeholder:text-[#939393]";
    const normalStyle = "border-[#494949] focus:border-[#494949]";
    const errorStyle = "border-red-500 focus:border-red-500";
    const inputClassName = `${baseStyle} ${error ? errorStyle : normalStyle}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block mb-1.5 text-[15px] font-normal text-[#393939]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={name}
            name={name}
            type={type}
            ref={ref}
            {...props}
            className={inputClassName}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            {rightAddon}
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
