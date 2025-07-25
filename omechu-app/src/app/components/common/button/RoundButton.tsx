import React from "react";

type RoundButtonProps = {
  variant: "red" | "white" | "gray";
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const RoundButton = ({
  variant,
  size = "md",
  children,
  ...props
}: RoundButtonProps) => {
  const baseStyle =
    "rounded-full font-medium flex items-center justify-center transition-colors border";

  const variantStyles = {
    red: "bg-primary-normal text-white border-transparent hover:bg-primary-normalHover active:bg-primary-normalActive",
    white:
      "bg-white text-black border-black hover:bg-gray-100 active:bg-gray-200",
    gray: "bg-white text-[#939393] border-[#939393] hover:bg-gray-100 active:bg-gray-200",
  };

  const sizeStyles = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  return (
    <button
      {...props}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${
        props.className || ""
      }`}
    >
      {children}
    </button>
  );
};

export default RoundButton;
