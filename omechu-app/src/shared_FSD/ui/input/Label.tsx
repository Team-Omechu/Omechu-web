import * as React from "react";

import { clsx } from "clsx";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export const Label = ({
  children,
  className,
  required,
  ...props
}: LabelProps) => {
  return (
    <label className={clsx("text-body-3-medium mb-3.5", className)} {...props}>
      {children}
      {required && <span className="text-color-status-warning ml-1">*</span>}
    </label>
  );
};

Label.displayName = "Label";
