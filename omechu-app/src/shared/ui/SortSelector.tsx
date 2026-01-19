export type SortOption = {
  label: string;
  value: string;
};

type SortSelectorProps = {
  options: SortOption[]; // [{ label: "추천", value: "recommend" }, ...]
  selected: string;
  onSelect: (value: string) => void;
  className?: string;
};

export function SortSelector({
  options,
  selected,
  onSelect,
  className = "",
}: SortSelectorProps) {
  return (
    <div className={`flex items-center justify-end gap-2 text-sm ${className}`}>
      {options.map((option, idx) => (
        <div key={option.value} className="flex items-center gap-2">
          {idx !== 0 && <div className="h-3 w-px bg-gray-400" />}
          <button
            className={
              selected === option.value ? "font-semibold" : "text-gray-500"
            }
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        </div>
      ))}
    </div>
  );
}
