type Item = {
  label: string;
  value: string;
};

type ToggleableListProps = {
  items: Item[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  maxSelected: number;
};

export default function ToggleableList({
  items,
  selectedValues,
  onToggle,
  maxSelected,
}: ToggleableListProps) {
  return (
    <div className="overflow-y-auto scrollbar-hide">
      {items.map(({ label, value }) => {
        const isSelected = selectedValues.includes(value);
        return (
          <button
            key={value}
            onClick={() => {
              if (isSelected || selectedValues.length < maxSelected) {
                onToggle(value);
              }
            }}
            className={`block w-full px-3 py-2 text-sm ${isSelected ? "rounded-full bg-gray-400 text-white" : ""}`}
          >
            {label} {isSelected && <span>✓</span>}
          </button>
        );
      })}
    </div>
  );
}
