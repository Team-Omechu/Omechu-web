import React, { useRef } from "react";

import Image from "next/image";

import Button from "./Button";

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
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="flex max-h-[80vh] w-[335px] flex-col gap-4 rounded-2xl bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <button onClick={onClose}>
            <Image src="/x_icon.png" alt="close" width={20} height={20} />
          </button>
        </div>
        <div
          ref={contentRef}
          className="flex-grow overflow-y-auto rounded-md border bg-gray-50 p-3 text-black scrollbar-hide"
        >
          {terms.map((item, key) => (
            <section
              key={key}
              className="mb-5 flex flex-col justify-start gap-1"
            >
              {item.index && item.about && (
                <div className="text-base font-bold">
                  제 {item.index}조 ({item.about})
                </div>
              )}
              {!item.index && !item.about && item.content === "부칙" && (
                <div className="text-base font-bold">{item.content}</div>
              )}
              <div
                className={`whitespace-pre-wrap text-sm leading-relaxed ${
                  item.index ? "text-gray-600" : "text-black"
                }`}
              >
                {item.content}
              </div>
            </section>
          ))}
        </div>
        <div className="relative">
          <button
            onClick={scrollToTop}
            className="absolute bottom-20 right-2 z-20"
          >
            <Image src="/fba.png" alt="맨 위로 스크롤" width={36} height={36} />
          </button>
        </div>
        <div className="mb-2 text-center text-xs text-gray-500">
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
