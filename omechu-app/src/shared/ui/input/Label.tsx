// ! 26.01.04 작업 완료

import * as React from "react";

import { clsx } from "clsx";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const Label = ({ children, className, ...props }: LabelProps) => {
  return (
    <label className={clsx("text-body-3-medium mb-3.5", className)} {...props}>
      {children}
    </label>
  );
};

Label.displayName = "Label";
