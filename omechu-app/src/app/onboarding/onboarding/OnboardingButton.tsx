import React from "react";

type OnboardingButtonProps = {
  isSelected: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const OnboardingButton = ({
  isSelected,
  children,
  ...props
}: OnboardingButtonProps) => {
  const baseStyle =
    "w-full h-12 px-0 py-2 rounded-md border-[1px] text-xl flex items-center justify-center transition-colors";
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

export default OnboardingButton;
