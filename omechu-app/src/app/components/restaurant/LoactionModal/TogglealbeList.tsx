type Item = {
  label: string;
  value: string;
};

type ToggleableListProps = {
  items: Item[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  maxSelected?: number;
};

export default function ToggleableList({ items, selectedValues, onToggle, maxSelected = 5 }: ToggleableListProps) {
  return (
    <div className="overflow-y-auto scrollbar-hide">
      {items.map(({label, value}) => {
        const isSelected = selectedValues.includes(value);
        return (
          <button
            key={value}
            onClick={() => {
              if (isSelected || selectedValues.length < maxSelected) {
                onToggle(value);
              }
            }}
            className={`block w-full px-3 py-2 text-sm ${isSelected ? "bg-gray-400 text-white rounded-full" : ""}`}
          >
            {label} {isSelected && <span>✓</span>}
          </button>
        );
      })}
    </div>
  );
}
