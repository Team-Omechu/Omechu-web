type TagItemProps = {
  label: string;
  onRemove: () => void;
  className?: string;
};

export default function TagItem({ label, onRemove, className = "" }: TagItemProps) {
  return (
    <div className={`bg-gray-400 rounded-full h-6 text-xs text-white flex items-center ${className}`}>
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
