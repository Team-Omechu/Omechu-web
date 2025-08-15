type TagListProps = {
  items: string[];
  onRemove: (item: string) => void;
};

export default function TagList({ items, onRemove }: TagListProps) {
  return (
    <div className="mt-2 flex min-h-28 flex-wrap justify-start gap-2 border-b border-grey-darkHover pb-6">
      {items.map((item) => (
        <span
          key={item}
          className="flex h-6 items-center gap-1 rounded-full bg-gray-400 px-2 py-1 text-xs text-white"
        >
          {item}
          <button onClick={() => onRemove(item)}>✕</button>
        </span>
      ))}
    </div>
  );
}
