"use client";

type Props = {
  selectedItems: string[];
  isDisabled?: (item: string) => boolean;
  onToggle: (item: string) => void;
};

const MealTypeGroup = ({ selectedItems, onToggle, isDisabled }: Props) => {
  const items = ["한식", "중식", "일식", "양식", "기타-종류"];

  const renderLabel = (item: string) =>
    item.startsWith("기타") ? "그 외" : item;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-center gap-[0.3125rem]">
        {items.map((item) => (
          <button
            key={item}
            className={`font-['Noto Sans KR'] flex h-[2.1875rem] w-[3.625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.3125rem] border border-grey-darkHover text-center text-[0.875rem] font-normal leading-normal ${
              selectedItems.includes(item)
                ? "border-[#FB4746] bg-[#FB4746] text-white"
                : "border-[#FB4746] bg-white text-[#393939]"
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
  );
};

export default MealTypeGroup;
