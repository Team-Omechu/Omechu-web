"use client";

type Props = {
  selectedItems: string[];
  isDisabled?:(item: string) => boolean;
  onToggle: (item: string) => void;
};

const MealStyleGroup = ({ selectedItems, onToggle,isDisabled }: Props) => {
  const stylePairs = [
    ["국물 있는 음식", "국물 없는 음식"],
    ["따뜻한 음식", "차가운 음식"],
    ["건강한 음식", "자극적인 음식"],
  ];

  const renderLabel = (item: string) =>
    item.startsWith("기타") ? "그 외" : item;

  return (
    <div className="flex flex-col gap-2">
      {stylePairs.map((pair, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-[0.3125rem] self-stretch">
            {pair.map((item) => (
              <button
                key={item}
                className={`font-['Noto Sans KR'] flex h-[2.1875rem] w-[7.8125rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.3125rem] border border-black p-[0.625rem] text-center text-[0.875rem] font-normal leading-normal ${
                  selectedItems.includes(item)
                    ? "border-[#FB4746] bg-[#FB4746] text-white"
                    : "border-[#FB4746] bg-white text-black"
                }`}
                onClick={() => onToggle(item)}
                disabled={isDisabled?.(item) ?? false}
              >
                {renderLabel(item)}
              </button>
            ))}
          </div>
          <div className="h-px w-full bg-grey-normalActive opacity-60" />
        </div>
      ))}
    </div>
  );
};

export default MealStyleGroup;
