import FoodBox from "@/components/common/FoodBox";
import { Menu } from "@/lib/types/menu";

interface FoodListSectionProps {
  items: Menu[];
  search: string;
  isSearched: boolean;
  isLoading?: boolean;
  onClickItem: (menuName: string) => void;
}

export default function FoodListSection({
  items,
  search,
  isSearched,
  isLoading = false,
  onClickItem,
}: FoodListSectionProps) {
  if (isSearched && search.trim() && items.length === 0) {
    return (
      <div className="mt-10 text-center text-sm text-gray-500">
        ‘{search}’에 대한 검색 결과가 없습니다.
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="mt-10 text-center text-sm text-gray-500">
        메뉴를 불러오는 중...
      </div>
    );
  }

  if (items.length > 0) {
    return (
      <div className="mt-4 grid grid-cols-3 gap-4">
        {items.map((food, idx) => (
          <FoodBox
            key={`${food.name}-${idx}`}
            title={food.name}
            imageUrl={food.image_link || "/logo/logo.png"}
            isExcluded={false}
            isToggled={false}
            onToggle={() => {}}
            onClick={() => onClickItem(food.name)}
          />
        ))}
      </div>
    );
  }

  if (!isLoading && items.length === 0 && !isSearched) {
    return (
      <div className="mt-10 text-center text-sm text-gray-500">
        메뉴 데이터가 없습니다.
      </div>
    );
  }

  return null;
}
