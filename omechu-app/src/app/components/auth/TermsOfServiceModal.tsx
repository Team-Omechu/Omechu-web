import React from "react";

import Image from "next/image";

import Button from "./Button";

type TermsOfServiceModalProps = {
  title: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
};

const TermsOfServiceModal = ({
  title,
  content,
  onConfirm,
  onClose,
}: TermsOfServiceModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="flex w-[335px] flex-col gap-4 rounded-2xl bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose}>
            <Image src="/x_icon.png" alt="close" width={20} height={20} />
          </button>
        </div>
        <div className="h-64 overflow-y-auto rounded-md border bg-gray-50 p-3 text-sm text-gray-600">
          {content}
        </div>
        <Button onClick={onConfirm} variant="red" size="medium">
          확인
        </Button>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
