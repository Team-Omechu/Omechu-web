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
      <div className="bg-white w-[335px] rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose}>
            <Image src="/x_icon.png" alt="close" width={20} height={20} />
          </button>
        </div>
        <div className="h-64 p-3 overflow-y-auto text-sm text-gray-600 border rounded-md bg-gray-50">
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
