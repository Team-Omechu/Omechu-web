import React from "react";

type ButtonProps = {
  variant?: "blue" | "red" | "yellow" | "text";
  size?: "large" | "medium" | "small";
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant = "blue",
  size = "large",
  leftIcon,
  children,
  ...props
}: ButtonProps) => {
  const baseStyle =
    "w-full rounded-md flex items-center justify-center font-medium active:scale-[.98]";

  const variantStyles = {
    blue: "bg-[#1F9BDA] text-white hover:bg-[#1c8cc4] active:bg-[#197cae] disabled:bg-gray-400 disabled:text-gray-200",
    red: "bg-[#FB4746] text-white hover:bg-[#e2403f] active:bg-[#c93938] disabled:bg-gray-400 disabled:text-gray-200",
    yellow:
      "bg-[#FDDC3F] text-black hover:bg-[#f2d033] active:bg-[#e7c428] disabled:bg-gray-400 disabled:text-gray-200",
    text: "bg-transparent text-[#828282] hover:underline",
  };

  const sizeStyles = {
    large: "h-[50px] text-base",
    medium: "h-11 text-base",
    small: "h-[38px] text-sm",
  };

  const className = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${props.className || ""}`;

  return (
    <button {...props} className={className}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  );
};

export default Button;
