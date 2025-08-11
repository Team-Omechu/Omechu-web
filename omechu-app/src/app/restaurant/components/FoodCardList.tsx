import FoodCard from "@/components/common/FoodCard";
import { Restaurant } from "@/lib/types/restaurant";

interface FoodCardListProps {
  items: Restaurant[];
  onItemClick: (id: number) => void;
}

export default function FoodCardList({
  items,
  onItemClick,
}: FoodCardListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item: Restaurant, idx) => (
        <FoodCard key={idx} item={item} onClick={() => onItemClick(item.id)} />
      ))}
    </div>
  );
}
