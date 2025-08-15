import { useState } from "react";

import Image from "next/image";

type ReportModalProps = {
  onClick: () => void;
  onReport: () => void;
};

export default function ReportModal({ onClick, onReport }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");

  const reasons = [
    { id: "abuse", label: "욕설, 비방" },
    { id: "ad", label: "광고, 홍보성 글" },
    { id: "false", label: "허위 사실" },
    { id: "offensive", label: "선정적 / 불쾌한 내용" },
    { id: "other", label: "기타" },
  ];

  return (
    <section className="relative flex h-fit w-80 flex-col items-center gap-5 rounded-2xl border border-grey-darkHover bg-white px-7 py-10">
      {/* 나가기 버튼 */}
      <div className="absolute right-4 top-4">
        <button onClick={onClick}>
          <Image
            src="/close_button.png"
            alt="나가기 버튼"
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* 모달 제목 */}
      <div className="mb-2 mt-5 text-2xl font-semibold text-[#393939]">
        후기 신고하기
      </div>

      {/* 신고 사유 */}
      <div className="w-full">
        <h1 className="mb-2">신고 사유를 선택해 주세요</h1>
        <div className="flex w-full flex-col items-start gap-2 px-1">
          {reasons.map(({ id, label }) => (
            <label
              key={id}
              htmlFor={id}
              className="flex items-center gap-2 text-sm text-[#626262]"
            >
              <input
                id={id}
                type="radio"
                name="reportReason"
                value={label}
                checked={selectedReason === label}
                onChange={() => setSelectedReason(label)}
                className="accent-[#1F9BDA]"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* 신고 내용 */}
      <textarea
        className="h-24 w-full resize-none rounded border border-[#ccc] px-2.5 py-2 text-sm text-[#393939] focus:outline-none"
        placeholder="신고 사유를 자세하게 설명해주세요. (선택)"
      />

      {/* 신고 버튼 */}
      <button
        onClick={onReport}
        className="h-10 w-36 rounded-3xl bg-[#FB4746] text-white hover:bg-[#e2403f] active:bg-[#c93938]"
      >
        <span>신고하기</span>
      </button>
    </section>
  );
}
