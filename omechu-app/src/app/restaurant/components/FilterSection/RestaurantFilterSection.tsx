import Image from "next/image";

import FilterTagList from "@/components/common/FilterTagList";

interface FilterSectionProps {
  selectedFilters: string[];
  onRemoveFilter: (tag: string) => void;
  onOpenFilterModal: () => void;
  onClickMyLocation: () => void; // ✅ 추가
}

export default function FilterSection({
  selectedFilters,
  onRemoveFilter,
  onOpenFilterModal,
  onClickMyLocation,
}: FilterSectionProps) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        className="flex flex-shrink-0 items-center justify-between gap-1"
        onClick={onClickMyLocation}
      >
        <Image
          src={"/location/location_zoom.svg"}
          alt="내 위치"
          width={16}
          height={16}
        />
        내 위치
      </button>
      <FilterTagList
        tags={selectedFilters}
        onRemove={onRemoveFilter}
        className="px-2"
      />
      <button className="ml-auto flex-shrink-0" onClick={onOpenFilterModal}>
        <Image
          src={"/menu/menu_filter.svg"}
          alt="사용자필터"
          width={32}
          height={32}
        />
      </button>
    </div>
  );
}
