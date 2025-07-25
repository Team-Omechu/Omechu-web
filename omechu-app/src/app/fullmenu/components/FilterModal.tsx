import { useState } from "react";

import Image from "next/image";

import Header from "@/components/common/Header";

type FilterModalProps = {
  onClose: () => void;
  onApply: (selected: string[]) => void;
  selected: string[];
};

// (TODO) 옵션이름은 DB구축되면 그에 따라 변경하기
const filterOptions = {
  time: ["아침", "점심", "저녁", "야식"],
  purpose: ["든든한 한 끼 식사", "술 겸 안주", "간식", "기념일 식사"],
  mood: [
    "들뜨고 신나요",
    "지치고 피곤해요",
    "슬프고 울적해요",
    "화나고 답답해요",
  ],
  companion: ["혼자", "연인", "친구들", "가족들"],
  budget: ["1만원 미만", "1만원 ~ 3만원", "3만원 초과"],
};

export default function FilterModal({
  onClose,
  onApply,
  selected,
}: FilterModalProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(selected);

  const toggleFilter = (item: string) => {
    setTempSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] h-screen w-screen overflow-y-auto bg-main-normal">
      <Header
        title={"식사 상황 선택"}
        rightChild={
          <button onClick={onClose}>
            <Image
              src={"/x/close_button.png"}
              alt={"닫기"}
              width={18}
              height={18}
            />
          </button>
        }
      />

      <div className="px-6 py-6">
        {Object.entries(filterOptions).map(([key, options]) => (
          <div key={key} className="mb-10">
            <p className="mb-3 text-[16px] font-semibold">
              {sectionTitle(key)}
            </p>
            <div className="flex flex-wrap gap-2">
              {options.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleFilter(item)}
                  className={`rounded-lg border border-gray-700 px-3 py-[6px] text-[14px] ${
                    tempSelected.includes(item)
                      ? "bg-primary-normal text-white"
                      : "border-gray-300 bg-white text-black"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          className="mx-24 mt-4 w-36 rounded-lg bg-primary-normal py-5 font-semibold text-white"
          onClick={() => {
            onApply(tempSelected);
            onClose();
          }}
        >
          적용하기
        </button>
      </div>
    </div>
  );
}

function sectionTitle(key: string) {
  switch (key) {
    case "time":
      return "언제 먹는 건가요?";
    case "purpose":
      return "식사 목적은 무엇인가요?";
    case "mood":
      return "기분 상태는 어떤가요?";
    case "companion":
      return "혼자 식사 하시나요, 누구와 함께 하시나요?";
    case "budget":
      return "예산은 어떻게 되시나요?";
    default:
      return "";
  }
}
