import Image from "next/image";

import { RestaurantType } from "@/app/constant/restaurant/restaurantList";
import { useState } from "react";

type FoodCardProps = {
  item: RestaurantType; // 타입은 foodItems 데이터 구조에 맞게 정의
  onClick: () => void;
};

export default function FoodCard({ item, onClick }: FoodCardProps) {
  const [isLiked, setIsLiked] = useState(item.isLiked ?? false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  return (
    <div
      className="flex items-start justify-between rounded-xl border border-black bg-white p-3 shadow-md"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{item.name}</span>
          <span className="flex items-center gap-1 text-xs font-normal text-yellow-500">
            ⭐ {item.rating}
            <span className="text-yellow-500">({item.reviews})</span>
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-500">{item.address.road}</p>
        <p className="mb-1 text-sm font-bold text-blue-600">{item.menu}</p>
        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          {item.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-blue-400 px-2 py-0.5 text-blue-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col place-items-end gap-2">
        <button onClick={handleLikeClick}>
          <Image 
            src={isLiked ? "/Heart_Filled.svg" : "/Heart.svg"} 
            alt="하트" 
            width={20} 
            height={20} />
        </button>
        <Image
          src={item.images?.[0] || "/restaurant_blank.png"}
          alt={item.menu}
          width={70}
          height={70}
          className="h-[4.5rem] w-[4.5rem] rounded-sm border border-gray-200 object-contain"
        />
      </div>
    </div>
  );
}
