import FoodBox from "@/components/common/FoodBox";

interface FoodListSectionProps {
  items: string[];
  search: string;
  isSearched: boolean;
  onClickItem: (item: string) => void;
}

export default function FoodListSection({
  items,
  search,
  isSearched,
  onClickItem,
}: FoodListSectionProps) {
  if (isSearched && search.trim() && items.length === 0) {
    return (
      <div className="mt-10 text-center text-sm text-gray-500">
        ‘{search}’에 대한 검색 결과가 없습니다.
      </div>
    );
  }

  if (items.length > 0) {
    return (
      <div className="mt-4 grid grid-cols-3 gap-4">
        {items.map((food, idx) => (
          <FoodBox
            key={food}
            title={food}
            imageUrl="/logo/logo.png"
            isExcluded={false}
            isToggled={false}
            onToggle={() => {}}
            onClick={() => onClickItem(food)}
          />
        ))}
      </div>
    );
  }

  return null;
}
