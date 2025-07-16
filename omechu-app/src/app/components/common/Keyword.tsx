interface KeywordProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function Keyword({ label, selected, onClick }: KeywordProps) {
  return (
    <button
      onClick={onClick}
      className={`h-7 w-20 rounded-full border border-gray-400 text-sm ${
        selected ? "bg-[#FB4746] text-white" : "bg-white text-gray-600"
      }`}
    >
      {label}
    </button>
  );
}
