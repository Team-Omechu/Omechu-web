import React from "react";

type ListButtonProps = {
  isSelected: boolean;
  textSize?: "sm" | "base" | "lg" | "xl";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ListButton = ({
  isSelected,
  children,
  textSize = "xl",
  ...props
}: ListButtonProps) => {
  const baseStyle = `w-full min-h-[3rem] h-auto px-4 py-2 rounded-md border-[1px] text-center flex items-center justify-center transition-colors text-${textSize}`;
  const selectedStyle =
    "bg-primary-normal text-white border-primary-normal hover:bg-primary-normalHover active:bg-primary-normalActive";
  const unselectedStyle =
    "bg-white text-primary-normal border-primary-normal hover:bg-primary-normalHover hover:text-white active:bg-primary-normalActive";

  return (
    <button
      {...props}
      className={`${baseStyle} ${
        isSelected ? selectedStyle : unselectedStyle
      } ${props.className || ""}`}
    >
      {children}
    </button>
  );
};

export default ListButton;
