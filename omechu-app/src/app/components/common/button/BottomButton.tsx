import React from "react";

type BottomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const BottomButton = ({ children, ...props }: BottomButtonProps) => {
  const baseStyle =
    "h-12 w-full bg-secondary-normal p-2 text-xl font-normal text-white hover:bg-[#0182CA] active:bg-secondary-normalActive disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:active:bg-gray-400";

  return (
    <button {...props} className={`${baseStyle} ${props.className || ""}`}>
      {children}
    </button>
  );
};

export default BottomButton;
