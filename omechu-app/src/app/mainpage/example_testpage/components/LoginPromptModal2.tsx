import React from "react";

import Image from "next/image";

import RoundButton from "@/components/common/button/RoundButton";

type LoginPromptModal2Props = {
  onConfirm: () => void; // "로그인 하기" 버튼 클릭 시
  onClose: () => void; // "X" 버튼 클릭 시
};

const LoginPromptModal2 = ({ onConfirm, onClose }: LoginPromptModal2Props) => {
  return (
    <div className="relative flex w-[315px] flex-col items-center rounded-[20px] bg-white px-6 pb-6 pt-6 text-center shadow-lg">
      <button onClick={onClose} className="absolute right-5 top-5 z-10 p-1">
        <Image src="/x/black_x_icon.svg" alt="close" width={24} height={24} />
      </button>

      <div className="mb-4">
        <Image
          src="/logo/logo.png"
          alt="Omechu Logo"
          width={106}
          height={70}
          className="drop-shadow-lg"
        />
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-xl text-grey-darker">더 많은 기능을 원하시나요?</h2>
        <p className="text-sm text-grey-normal-active">
          로그인 후 더 다양한 서비스를 누려보세요
        </p>
      </div>

      <div className="w-full px-16">
        <RoundButton
          onClick={onConfirm}
          variant="red"
          size="md"
          className="w-full"
        >
          로그인 하기
        </RoundButton>
      </div>
    </div>
  );
};

export default LoginPromptModal2;
