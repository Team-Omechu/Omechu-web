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
      <div className="bg-white w-[335px] rounded-2xl p-5 flex flex-col gap-4 shadow-lg max-h-[80vh]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">{title}</h2>
          <button onClick={onClose}>
            <Image src="/x_icon.png" alt="close" width={20} height={20} />
          </button>
        </div>
        <div
          ref={contentRef}
          className="flex-grow p-3 overflow-y-auto border rounded-md text-black bg-gray-50 scrollbar-hide"
        >
          {terms.map((item, key) => (
            <section
              key={key}
              className="flex flex-col justify-start gap-1 mb-5"
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
                className={`text-sm leading-relaxed whitespace-pre-wrap ${
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
