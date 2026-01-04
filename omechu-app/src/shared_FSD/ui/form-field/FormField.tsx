import * as React from "react";

import { clsx } from "clsx";

import { HelperText } from "@/shared_FSD/ui/input/HelperText";
import { Label } from "@/shared_FSD/ui/input/Label";

type HelperState = "error" | "success";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  id: string;
  required?: boolean;

  helperText?: string;
  helperState?: HelperState;

  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}

export const FormField = ({
  label,
  id,
  helperText,
  helperState,
  rightSlot,
  children,
  className,
  ...props
}: FormFieldProps) => {
  const helperId = helperText ? `${id}-helper` : undefined;

  const enhancedChildren = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        id,
        "aria-describedby": helperId,
        "aria-invalid": helperState === "error" ? true : undefined,
      })
    : children;

  return (
    <div className={clsx("flex flex-col", className)} {...props}>
      <Label htmlFor={id}>{label}</Label>

      <div className={clsx("mt-2 flex items-center gap-3")}>
        {enhancedChildren}
        {rightSlot}
      </div>

      {helperText && helperState && (
        <HelperText id={helperId} state={helperState}>
          {helperText}
        </HelperText>
      )}

      {helperText && !helperState && (
        <p
          id={helperId}
          className="text-caption-2-regular text-font-placeholder mt-4 ml-1"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

FormField.displayName = "FormField";
