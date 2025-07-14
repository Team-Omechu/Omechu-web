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
      <div className="relative flex min-h-[300px] w-[310px] flex-col items-center justify-end rounded-2xl bg-white p-6 text-center shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 z-10">
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

        <div className="mb-4 flex flex-col gap-2">
          <h2 className="text-xl font-bold">더 정교한 추천을 원하시나요?</h2>
          <p className="text-sm text-gray-500">
            로그인 후 더 다양한 서비스를 누려보세요!
          </p>
        </div>
        <Button
          onClick={onConfirm}
          variant="text"
          size="small"
          className="h-auto w-auto !text-base !font-bold !text-[] underline"
        >
          로그인 하러 가기
        </Button>
      </div>
    </div>
  );
};

export default LoginPromptModal;
