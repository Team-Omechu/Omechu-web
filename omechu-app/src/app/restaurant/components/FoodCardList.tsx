import FoodCard from "@/components/common/FoodCard";
import { RestaurantType } from "@/constant/restaurant/restaurantList";

interface FoodCardListProps {
  items: RestaurantType[];
  onItemClick: (id: number) => void;
}

export default function FoodCardList({
  items,
  onItemClick,
}: FoodCardListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, idx) => (
        <FoodCard key={idx} item={item} onClick={() => onItemClick(item.id)} />
      ))}
    </div>
  );
}
