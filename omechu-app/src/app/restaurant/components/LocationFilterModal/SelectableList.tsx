type SelectableListProps = {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
  topItems?: string[];
};

export default function SelectableList({
  items,
  selected,
  onSelect,
  topItems = [],
}: SelectableListProps) {
  const allItems = [...topItems, ...items];
  return (
    <div className="overflow-y-auto border-r border-grey-darkHover scrollbar-hide">
      {allItems.map((item) => (
        <button
          key={item}
          className={`block w-full px-3 py-2 text-sm ${selected === item ? "rounded-full bg-gray-400 text-white" : ""}`}
          onClick={() => onSelect(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
