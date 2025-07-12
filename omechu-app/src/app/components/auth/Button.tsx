import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "red" | "yellow" | "text" | "gray" | "blue";
  size: "large" | "medium" | "small";
  leftIcon?: React.ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, leftIcon, ...props }, ref) => {
    const baseStyle =
      "w-full flex items-center justify-center gap-2 font-normal rounded-[6px] active:scale-[.98]";

    const variantStyles = {
      red: "bg-[#FB4746] text-white hover:bg-[#e2403f] active:bg-[#c93938] disabled:bg-gray-300",
      yellow:
        "bg-[#FDDC3F] text-black hover:bg-[#f2d033] active:bg-[#e7c428] disabled:bg-gray-400 disabled:text-gray-200",
      text: "bg-transparent text-[#828282] hover:underline",
      gray: "bg-gray-300 text-gray-500 hover:bg-gray-400 active:bg-gray-500 disabled:bg-gray-400 disabled:text-gray-200",
      blue: "bg-[#1F9BDA] text-white hover:bg-[#1c8cc4] active:bg-[#197cae] disabled:bg-gray-300",
    };

    const sizeStyles = {
      large: "h-[50px] text-[15px]",
      medium: "h-11 text-base",
      small: "h-[38px] text-sm",
    };

    const className = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${props.className || ""}`;

    return (
      <button ref={ref} {...props} className={className}>
        {leftIcon}
        {props.children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
