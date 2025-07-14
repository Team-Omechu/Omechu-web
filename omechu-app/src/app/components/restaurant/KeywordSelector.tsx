type KeywordSelectorProps = {
  keywords: string[];
  selected: string[];
  onToggle: (keyword: string) => void;
  maxSelected: number;
};

export default function KeywordSelector({ keywords, selected, onToggle, maxSelected }: KeywordSelectorProps) {
  return (
    <div className="flex flex-wrap justify-end gap-1 text-xs mb-4">
      {keywords.map((keyword, idx) => {
        const isSelected = selected.includes(keyword);
        return (
          <button
            key={idx}
            onClick={() => {
              if (isSelected || selected.length < maxSelected)
                onToggle(keyword);
            }}
            className={`w-20 h-7 rounded-full border border-gray-400 text-sm ${
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
