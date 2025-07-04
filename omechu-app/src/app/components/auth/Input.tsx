import React, { forwardRef } from "react";

type InputProps = {
  label?: string;
  error?: string;
  rightAddon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, error, rightAddon, ...props }, ref) => {
    const baseStyle =
      "w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2";
    const normalStyle =
      "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
    const errorStyle = "border-red-500 focus:ring-red-500 focus:border-red-500";
    const inputClassName = `${baseStyle} ${error ? errorStyle : normalStyle}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={name}
            name={name}
            ref={ref}
            {...props}
            className={inputClassName}
          />
          {rightAddon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightAddon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
