type SectionHeaderProps = {
  titles: string[];
};

export default function SectionHeader({ titles }: SectionHeaderProps) {
  return (
    <div className="grid grid-cols-3 border-b border-gray-300">
      {titles.map((title, i) => (
        <div
          key={i}
          className={`bg-[#00A3FF] text-white text-center py-2 text-sm ${i < titles.length - 1 ? "border-r border-white" : ""}`}
        >
          {title}
        </div>
      ))}
    </div>
  );
}
