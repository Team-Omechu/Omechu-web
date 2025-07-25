import React from "react";

type UserInfoSetupButtonProps = {
  isSelected: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const UserInfoSetupButton = ({
  isSelected,
  children,
  ...props
}: UserInfoSetupButtonProps) => {
  const baseStyle =
    "w-full h-12 px-0 py-2 rounded-md border-[1px] text-xl flex items-center justify-center transition-colors";
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

export default UserInfoSetupButton;
