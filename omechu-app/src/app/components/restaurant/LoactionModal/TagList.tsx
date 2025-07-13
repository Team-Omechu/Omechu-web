type TagListProps = {
  items: string[];
  onRemove: (item: string) => void;
};

export default function TagList({ items, onRemove }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2 pb-6 justify-start border-b border-gray-600 min-h-28">
      {items.map((item) => (
        <span
          key={item}
          className="bg-gray-400 text-white text-xs rounded-full px-2 py-1 h-6 flex items-center gap-1"
        >
          {item}
          <button onClick={() => onRemove(item)}>✕</button>
        </span>
      ))}
    </div>
  );
}
