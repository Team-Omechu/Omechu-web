import * as React from "react";

import { clsx } from "clsx";

export interface HelperTextProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  state: "default" | "error" | "success";
}

export const HelperText = ({
  children,
  className,
  state,
  ...props
}: HelperTextProps) => {
  return (
    <p
      className={clsx(
        "text-caption-2-regular mt-4 ml-1",
        {
          default: "text-font-placeholder",
          error: "text-[#FF364B]", // 피그마에 토큰으로는 저장되어 있는데, 디자인 시스템에는 없어서 일단 하드코딩했습니당;
          success: "text-tag-blue",
        }[state],
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};

HelperText.displayName = "HelperText";
