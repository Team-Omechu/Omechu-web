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
    "w-full h-[45px] rounded-md border text-lg flex items-center justify-center";
  const selectedStyle = "bg-red-500 text-white border-red-500";
  const unselectedStyle = "bg-white text-red-500 border-red-500";

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
