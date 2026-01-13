import { forwardRef, type MouseEventHandler } from "react";

import { CalenderIcon } from "@/shared/assets/icons/index";

export const CustomInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: MouseEventHandler<HTMLButtonElement> }
>(({ value, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="border-font-extralow bg-background-secondary text-font-high text-body-4-regular relative flex h-10 w-37.5 items-center rounded-[10px] border pl-5"
  >
    <CalenderIcon
      className="absolute top-1.5 -right-3 w-12"
      currentColor={"#707070"}
    />

    {value || "날짜 선택"}
  </button>
));
CustomInput.displayName = "CustomInput";
