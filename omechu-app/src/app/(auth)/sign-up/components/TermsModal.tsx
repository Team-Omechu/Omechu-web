import React from "react";

import Image from "next/image";

import RoundButton from "@/components/common/button/RoundButton";

type Term = {
  index: number | null;
  about: string | null;
  content: string;
};

type TermsModalProps = {
  title: string;
  terms: Term[];
  onConfirm: () => void;
  onClose: () => void;
};

const TermsModal = ({ title, terms, onConfirm, onClose }: TermsModalProps) => {
  return (
    <div className="flex max-h-[80vh] w-[335px] flex-col gap-4 rounded-2xl bg-white p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#393939]">{title}</h2>
        <button onClick={onClose}>
          <Image
            src="x/black_x_icon.svg"
            alt="close"
            width={17}
            height={17}
          />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto rounded-md border bg-gray-50 p-3 text-[#393939] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-[#3B82F6] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
        {terms.map((item, key) => (
          <section key={key} className="mb-5 flex flex-col justify-start gap-1">
            {item.index && item.about && (
              <div className="text-sm font-bold">
                제 {item.index}조 ({item.about})
              </div>
            )}
            {!item.index && !item.about && item.content === "부칙" && (
              <div className="text-sm font-bold">{item.content}</div>
            )}
            <div
              className={`whitespace-pre-wrap text-sm leading-relaxed ${
                item.index ? "text-gray-600" : "text-[#393939]"
              }`}
            >
              {item.content}
            </div>
          </section>
        ))}
      </div>
      <div className="mb-2 text-center text-sm text-gray-500">
        위의 내용을 모두 확인했으며 <br /> 이에 동의합니다.
      </div>
      <div className="flex justify-center">
        <RoundButton
          variant="red"
          size="md"
          onClick={onConfirm}
          className="px-12"
        >
          확인
        </RoundButton>
      </div>
    </div>
  );
};

export default TermsModal;
