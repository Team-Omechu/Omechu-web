interface KeywordProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export default function Keyword({
  label,
  selected,
  onClick,
  className,
}: KeywordProps) {
  return (
    <button
      onClick={onClick}
      className={`h-7 w-20 rounded-full border border-grey-darkHover text-sm ${className} ${
        selected ? "bg-primary-normal text-white" : "bg-white text-gray-600"
      }`}
    >
      {label}
    </button>
  );
}
