import Keyword from "@/app/components/common/Keyword";

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
          <Keyword
            key={keyword}
            label={keyword}
            selected={isSelected}
            onClick={() => {
              if (isSelected || selected.length < maxSelected) {
                onToggle(keyword);
              }
            }}
          />
        );
      })}
    </div>
  );
}
