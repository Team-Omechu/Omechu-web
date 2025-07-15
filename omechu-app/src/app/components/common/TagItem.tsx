type TagItemProps = {
  label: string;
  onRemove: () => void;
  className?: string;
};

export default function TagItem({
  label,
  onRemove,
  className = "",
}: TagItemProps) {
  return (
    <div
      className={`flex h-6 items-center rounded-full bg-gray-400 text-xs text-white ${className}`}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-2 text-sm text-gray-300 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
