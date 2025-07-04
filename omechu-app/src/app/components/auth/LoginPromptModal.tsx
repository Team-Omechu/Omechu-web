import React from "react";
import Image from "next/image";
import Button from "./Button";

type LoginPromptModalProps = {
  onConfirm: () => void;
  onClose: () => void;
};

const LoginPromptModal = ({ onConfirm, onClose }: LoginPromptModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white w-[310px] min-h-[300px] rounded-2xl p-6 flex flex-col items-center justify-end text-center shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 z-10">
          <Image src="/x_icon.png" alt="close" width={20} height={20} />
        </button>

        <div className="absolute -top-12">
          <Image
            src="/logo_3d.png"
            alt="Omechu Logo"
            width={160}
            height={160}
            className="drop-shadow-lg"
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-xl font-bold">더 쉽고 편한 추천을 원하시나요?</h2>
          <p className="text-sm text-gray-500">
            로그인하고 더 다양한 서비스를 이용하세요!
          </p>
        </div>
        <Button
          onClick={onConfirm}
          variant="text"
          size="small"
          className="w-auto h-auto !font-bold !text-base !text-[#FB4746]"
        >
          로그인 하러 가기
        </Button>
      </div>
    </div>
  );
};

export default LoginPromptModal;
