"use client";

import { MouseEvent } from "react";

import Button from "./Button";

interface AlertModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
}

export default function AlertModal({
  title,
  message,
  onConfirm,
}: AlertModalProps) {
  const handleWrapperClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onConfirm();
    }
  };

  return (
    <div
      onClick={handleWrapperClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div className="flex w-[300px] flex-col items-center gap-6 rounded-lg bg-white p-6 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <Button
          onClick={onConfirm}
          variant="red"
          size="large"
          className="w-full rounded-full"
        >
          확인
        </Button>
      </div>
    </div>
  );
}
