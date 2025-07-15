"use client";

type Props = {
  selectedItems: string[];
  onToggle: (item: string) => void;
};

const MealStyleGroup = ({ selectedItems, onToggle }: Props) => {
  const stylePairs = [
    ["국물 있는 음식", "국물 없는 음식"],
    ["따뜻한 음식", "차가운 음식"],
    ["건강한 음식", "자극적인 음식"],
  ];

  const renderLabel = (item: string) => (item.startsWith("기타") ? "그 외" : item);
  const isDisabled = (item: string) =>
    !selectedItems.includes(item) && selectedItems.length >= 3;

  return (
    <div className="flex flex-col gap-2">
      {stylePairs.map((pair, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex items-center gap-[0.3125rem] self-stretch flex-wrap">
            {pair.map((item) => (
              <button
                key={item}
                className={`flex w-[7.8125rem] h-[2.1875rem] p-[0.625rem] justify-center items-center gap-[0.625rem] flex-shrink-0 rounded-[0.3125rem] border border-black text-center font-['Noto Sans KR'] text-[0.875rem] font-normal leading-normal ${
                  selectedItems.includes(item)
                    ? "bg-[#FB4746] text-white"
                    : "bg-white"
                }`}
                onClick={() => onToggle(item)}
                disabled={isDisabled(item)}
              >
                {renderLabel(item)}
              </button>
            ))}
          </div>
          <div className="w-full h-px bg-[#828282] opacity-60" />
        </div>
      ))}
    </div>
  );
};

export default MealStyleGroup;
