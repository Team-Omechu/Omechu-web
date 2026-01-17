// ! 26.01.04 작업 완료

import * as React from "react";

import { cn } from "@/shared/lib/cn.util";

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
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
      className={cn(
        "text-caption-2-regular mt-4 ml-1",
        {
          default: "text-font-placeholder",
          error: "text-status-error",
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
