import Image from "next/image";

import FilterTagList from "@/components/restaurant/FilterSection/FilterTagList";

interface FilterSectionProps {
  tags: string[];
  onRemove: (tag: string) => void;
  onOpen: () => void;
}

export default function FilterSection({
  tags,
  onRemove,
  onOpen,
}: FilterSectionProps) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <FilterTagList tags={tags} onRemove={onRemove} className="px-5" />
      <button className="ml-auto" onClick={onOpen}>
        <Image
          src={"/customselect.png"}
          alt="사용자필터"
          className="h-8 w-8"
          width={32}
          height={32}
        />
      </button>
    </div>
  );
}
