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
    "bg-[#FB4746] text-white border-[#FB4746] hover:bg-[#e2403f] active:bg-[#c93938]";
  const unselectedStyle =
    "bg-white text-[#FB4746] border-[#FB4746] hover:bg-[#e2403f] hover:text-white active:bg-[#c93938]";

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
