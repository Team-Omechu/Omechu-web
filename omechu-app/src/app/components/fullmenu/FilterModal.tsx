import { useState } from "react";
import Image from "next/image";
import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";

type FilterModalProps = {
  onClose: () => void;
  onApply: (selected: string[]) => void;
  selected: string[];
};

// (TODO) 옵션이름은 DB구축되면 그에 따라 변경하기
const filterOptions = {
  time: ["아침", "점심", "저녁", "야식"],
  purpose: ["든든한 한 끼 식사", "술 겸 안주", "간식", "기념일 식사"],
  mood: ["들뜨고 신나요", "지치고 피곤해요", "슬프고 울적해요", "화나고 답답해요"],
  companion: ["혼자", "연인", "친구들", "가족들"],
  budget: ["1만원 미만", "1만원 ~ 3만원", "3만원 초과"]
};

export default function FilterModal({ onClose, onApply, selected }: FilterModalProps) {
  const router = useRouter();
  const [tempSelected, setTempSelected] = useState<string[]>(selected);

  const toggleFilter = (item: string) => {
    setTempSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F8D5FF] w-screen h-screen overflow-y-auto">
        <Header
                title={"식사 상황 선택"}
                rightChild={
                    <button onClick={() => {router.back()}}>
                        <Image
                            src={"/close_button.png"}
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
                <p className="text-[16px] mb-3 font-semibold">{sectionTitle(key)}</p>
                <div className="flex flex-wrap gap-2">
                {options.map((item) => (
                    <button
                    key={item}
                    onClick={() => toggleFilter(item)}
                    className={`px-3 py-[6px] rounded-lg text-[14px] border border-gray-700
                        ${tempSelected.includes(item)
                            ? "bg-[#FB4746] text-white"
                            : "bg-white text-black border-gray-300"}`}
                    >
                    {item}
                    </button>
                ))}
                </div>
            </div>
            ))}

            <button
                className="mx-24 mt-4 w-36 bg-[#FB4746] text-white font-semibold py-5 rounded-lg"
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
    case "time": return "언제 먹는 건가요?";
    case "purpose": return "식사 목적은 무엇인가요?";
    case "mood": return "기분 상태는 어떤가요?";
    case "companion": return "혼자 식사 하시나요, 누구와 함께 하시나요?";
    case "budget": return "예산은 어떻게 되시나요?";
    default: return "";
  }
}
