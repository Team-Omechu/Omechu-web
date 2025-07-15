import React from "react";

type InlineAlertProps = {
  message: string;
};

export default function InlineAlert({ message }: InlineAlertProps) {
  if (!message) return null;

  return (
    <div className="mt-4 flex h-[70px] w-full items-center justify-center whitespace-pre-line rounded-md bg-[rgba(130,130,130,0.5)] text-center text-sm text-white">
      {message}
    </div>
  );
}