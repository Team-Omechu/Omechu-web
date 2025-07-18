type KeywordSelectorProps = {
  keywords: string[];
  selected: string[];
  onToggle: (keyword: string) => void;
  maxSelected: number;
};

export default function KeywordSelector({
  keywords,
  selected,
  onToggle,
  maxSelected,
}: KeywordSelectorProps) {
  return (
    <div className="mb-4 flex flex-wrap justify-end gap-1 text-xs">
      {keywords.map((keyword, idx) => {
        const isSelected = selected.includes(keyword);
        return (
          <button
            key={idx}
            onClick={() => {
              if (isSelected || selected.length < maxSelected)
                onToggle(keyword);
            }}
            className={`h-7 w-20 rounded-full border border-gray-400 text-sm ${
              isSelected ? "bg-[#FB4746] text-white" : "bg-white text-gray-600"
            }`}
          >
            {keyword}
          </button>
        );
      })}
    </div>
  );
}
