import React from "react";
import Image from "next/image";
import Button from "./Button";

type PrivacyModalProps = {
  onConfirm: () => void;
  onClose: () => void;
};

const PrivacyModal = ({ onConfirm, onClose }: PrivacyModalProps) => {
  const title = "개인정보 처리방침";
  const content = `1. 수집하는 개인정보 항목: 이메일, 비밀번호, 서비스 이용 기록, 접속 로그
2. 개인정보 수집 및 이용 목적: 회원제 서비스 제공, 본인 확인, 불량회원 관리, 서비스 개선
3. 개인정보 보유 및 이용 기간: 회원 탈퇴 시까지. 단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간까지 보관합니다.
4. 개인정보의 제3자 제공: 법령에 근거한 경우를 제외하고, 이용자의 사전 동의 없이 개인정보를 제3자에게 제공하지 않습니다.`;

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

export default PrivacyModal;
