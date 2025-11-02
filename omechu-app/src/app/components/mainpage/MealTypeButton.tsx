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
      <div className="flex flex-wrap items-center justify-center gap-1.25">
        {items.map((item) => (
          <button
            key={item}
            className={`font-['Noto Sans KR'] flex h-8.75 w-14.5 shrink-0 items-center justify-center gap-2.5 rounded-[0.3125rem] border border-grey-dark-hover text-center text-[0.875rem] font-normal leading-normal ${
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
      <div className="h-px w-full bg-grey-normal-active opacity-60" />
    </div>
  );
};

export default MealTypeGroup;
