"use client";

type Props = {
  selectedItems: string[];
  onToggle: (item: string) => void;
};

const MealIngredientGroup = ({ selectedItems, onToggle }: Props) => {
  const items = ["밥", "면", "고기", "해산물", "기타-재료"];

  const renderLabel = (item: string) =>
    item.startsWith("기타") ? "그 외" : item;
  const isDisabled = (item: string) =>
    !selectedItems.includes(item) && selectedItems.length >= 3;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-[0.3125rem] self-stretch">
        {items.map((item) => (
          <button
            key={item}
            className={`font-['Noto Sans KR'] flex h-[2.1875rem] w-[3.625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.3125rem] border border-black text-center text-[0.875rem] font-normal leading-normal ${
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
      <div className="h-px w-full bg-[#828282] opacity-60" />
    </div>
  );
};

export default MealIngredientGroup;
