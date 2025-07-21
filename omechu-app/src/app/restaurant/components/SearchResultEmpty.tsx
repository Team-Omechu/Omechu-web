import FoodCard from "@/components/common/FoodCard";
import { RestaurantType } from "@/constant/restaurant/restaurantList";

interface SearchResultEmptyProps {
  search: string;
  similarItems: RestaurantType[];
  onItemClick: (id: number) => void;
}

export default function SearchResultEmpty({
  search,
  similarItems,
  onItemClick,
}: SearchResultEmptyProps) {
  return (
    <div className="mb-12 mt-10 px-2">
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold text-black">
          ‘{search}’에 대한 검색 결과가 없습니다.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          검색어와 비슷한 결과를 알려드릴게요
        </p>
      </div>

      <hr className="mt-8 w-full border-t border-gray-600" />

      {similarItems.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          {similarItems.map((item, idx) => (
            <FoodCard
              key={idx}
              item={item}
              onClick={() => onItemClick(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
