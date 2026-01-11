//! 26.01.12 작업 완료

"use client";

import React, { useState } from "react";

import CloseIcon from "@/shared_FSD/assets/icons/mypage/CloseIcon";
import { BaseModal } from "@/shared_FSD/ui/modal/BaseModal";

interface MypageModalProps {
  title: string;
  placeholder?: string;
  onLeftButtonClick: () => void;
  onRightButtonClick: () => void;
}

export const MypageModal = ({
  title,
  placeholder = "닉네임",
  onLeftButtonClick,
  onRightButtonClick,
}: MypageModalProps) => {
  const [value, setValue] = useState("");
  return (
    <BaseModal
      isCloseButtonShow={false}
      leftButtonText="취소"
      rightButtonText="변경하기"
      onLeftButtonClick={onLeftButtonClick}
      onRightButtonClick={onRightButtonClick}
    >
      <div className="relative flex w-full flex-col items-center justify-center gap-4 px-1">
        <div className="text-body-2-bold text-font-high">{title}</div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="border-font-disabled h-12 w-full rounded-[10px] border pr-9 pl-4"
        />
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-4 bottom-3.5"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
    </BaseModal>
  );
};
