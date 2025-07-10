import React from "react";
import Image from "next/image";
import Button from "./Button";

type TermsModalProps = {
  onConfirm: () => void;
  onClose: () => void;
};

const TermsModal = ({ onConfirm, onClose }: TermsModalProps) => {
  const title = "서비스 이용약관";
  const content = `1. 목적: 본 약관은 오메추가 제공하는 서비스의 이용과 관련하여 제반 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
2. 이용자 정의: 이 약관에 동의하고 서비스를 이용하는 자를 '이용자'라 합니다.
3. 서비스 제공: 오메추는 이용자에게 메뉴 추천, 식사 기록, 통계 제공 등 기능을 제공합니다.
4. 이용자의 의무: 타인의 정보를 도용하거나 부정한 목적으로 서비스를 사용해서는 안됩니다. 서비스 내 제공된 콘텐츠를 무단으로 복제, 배포할 수 없습니다.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-[335px] rounded-2xl p-5 flex flex-col gap-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose}>
            <Image src="/x_icon.png" alt="close" width={20} height={20} />
          </button>
        </div>
        <div className="h-64 p-3 overflow-y-auto text-sm text-gray-600 border rounded-md bg-gray-50 whitespace-pre-wrap">
          {content}
        </div>
        <div className="text-center text-xs text-gray-500 mb-2">
          위의 내용을 모두 확인했으며 이에 동의합니다.
        </div>
        <Button onClick={onConfirm} variant="red" size="medium">
          확인
        </Button>
      </div>
    </div>
  );
};

export default TermsModal;
