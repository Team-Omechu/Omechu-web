import React from "react";

type ButtonProps = {
  variant?: "blue" | "red" | "yellow" | "text";
  size?: "large" | "medium" | "small";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  variant = "blue",
  size = "large",
  children,
  ...props
}: ButtonProps) => {
  const baseStyle =
    "w-full rounded-md flex items-center justify-center font-medium active:scale-[.98]";

  const variantStyles = {
    blue: "bg-[#1F9BDA] text-white hover:bg-[#1c8cc4] active:bg-[#197cae] disabled:bg-gray-400 disabled:text-gray-200",
    red: "bg-[#FB4746] text-white hover:bg-[#e2403f] active:bg-[#c93938] disabled:bg-gray-400 disabled:text-gray-200",
    yellow:
      "bg-[#FEE500] text-black hover:bg-[#fde93a] active:bg-[#fddf00] disabled:bg-gray-400 disabled:text-gray-200",
    text: "bg-transparent text-[#828282] hover:underline",
  };

  const sizeStyles = {
    large: "h-14 text-lg",
    medium: "h-12 text-base",
    small: "h-10 text-sm",
  };

  const className = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${props.className || ""}`;

  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
};

export default Button;
