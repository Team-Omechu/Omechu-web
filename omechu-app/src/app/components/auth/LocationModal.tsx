import React from "react";
import Image from "next/image";
import Button from "./Button";

type LocationModalProps = {
  onConfirm: () => void;
  onClose: () => void;
};

const LocationModal = ({ onConfirm, onClose }: LocationModalProps) => {
  const title = "위치기반 서비스 이용약관";
  const content = `1. 서비스 내용: 이용자의 현재 위치를 기반으로 주변 음식점 추천, 길찾기 등 위치기반 서비스를 제공합니다.
2. 위치정보 수집 및 이용: 서비스 제공을 위해 이용자의 위치정보를 수집하며, 이는 이용자의 동의 하에 이루어집니다.
3. 위치정보 보유 기간: 수집된 위치정보는 관련 법령에 따라 안전하게 보관되며, 목적 달성 시 파기됩니다.
4. 권리: 이용자는 언제든지 위치정보 제공에 대한 동의를 철회할 수 있습니다.`;

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

export default LocationModal;
