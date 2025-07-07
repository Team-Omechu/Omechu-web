type TagItemProps = {
  label: string;
  onRemove: () => void;
};

export default function TagItem({ label, onRemove }: TagItemProps) {
  return (
    <div className="bg-gray-400 rounded-full h-6 px-6 text-xs text-white flex items-center">
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
