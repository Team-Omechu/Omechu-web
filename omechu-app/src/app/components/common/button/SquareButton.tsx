import React from "react";

type SquareButtonProps = {
  variant: "red" | "sky";
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const SquareButton = ({
  variant,
  size = "md",
  children,
  ...props
}: SquareButtonProps) => {
  const baseStyle =
    "rounded-md font-medium flex items-center justify-center transition-colors border";

  const variantStyles = {
    red: "bg-primary-normal text-white border-transparent hover:bg-primary-normalHover active:bg-primary-normalActive",
    sky: "bg-white text-[#1F9BDA] border-[#1F9BDA] hover:bg-[#1F9BDA] hover:text-white active:bg-[#1c8cc4] active:border-[#1c8cc4]",
  };

  const sizeStyles = {
    sm: "h-9 px-4 text-sm",
    md: "h-12 px-6 text-lg",
    lg: "h-14 px-8 text-xl",
  };

  const disabledStyle =
    "disabled:bg-gray-300 disabled:text-gray-500 disabled:border-transparent disabled:cursor-not-allowed";

  return (
    <button
      {...props}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyle} ${
        props.className || ""
      }`}
    >
      {children}
    </button>
  );
};

export default SquareButton;
