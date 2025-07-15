import React from "react";

type BottomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const BottomButton = ({ children, ...props }: BottomButtonProps) => {
  const baseStyle =
    "h-12 w-full bg-[#1F9BDA] p-2 text-xl font-normal text-white hover:bg-[#1c8cc4] active:bg-[#197cae] disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:active:bg-gray-400";

  return (
    <button {...props} className={`${baseStyle} ${props.className || ""}`}>
      {children}
    </button>
  );
};

export default BottomButton;
