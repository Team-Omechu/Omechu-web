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

  const renderLabel = (item: string) =>
    item.startsWith("기타") ? "그 외" : item;
  const isDisabled = (item: string) =>
    !selectedItems.includes(item) && selectedItems.length >= 3;

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
                    ? "border-primary-normal bg-primary-normal text-white hover:bg-primary-normalHover active:bg-primary-normalActive"
                    : "border-primary-normal bg-white text-black hover:bg-primary-normalHover hover:text-white active:bg-primary-normalActive"
                }`}
                onClick={() => onToggle(item)}
                disabled={isDisabled(item)}
              >
                {renderLabel(item)}
              </button>
            ))}
          </div>
          <div className="h-px w-full bg-[#828282] opacity-60" />
        </div>
      ))}
    </div>
  );
};

export default MealStyleGroup;
