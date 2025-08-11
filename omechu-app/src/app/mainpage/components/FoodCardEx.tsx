import { useState } from "react";

import Image from "next/image";

import { Restaurant } from "@/constant/mainpage/RestaurantData";
import { useDeleteHeart, usePostHeart } from "../hooks/useHeart";

type FoodCardProps = {
  item: Restaurant; // 타입은 foodItems 데이터 구조에 맞게 정의
  menu: string;
  restaurantId: number;
  onClick?: () => void;
};

export default function FoodCard({
  item,
  onClick,
  menu,
  restaurantId,
}: FoodCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { mutate: addHeart } = usePostHeart(restaurantId);
  const { mutate: deleteHeart } = useDeleteHeart(restaurantId);

  const handleHeartClick = () => {
    if (isLiked) {
      deleteHeart();
    } else {
      addHeart();
    }
    setIsLiked(!isLiked);
  };
  return (
    <div
      className="flex items-start justify-between rounded-xl border border-black bg-white p-3 shadow-md"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{item.displayName.text}</span>
          <span className="flex items-center gap-1 text-xs font-normal text-yellow-500">
            ⭐ {item.rating}
            <span className="text-yellow-500">({item.userRatingCount})</span>
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-500">{item.formattedAddress}</p>
        <p className="mb-1 text-sm font-bold text-blue-600">{menu}</p>
        <div className="mt-1 flex flex-wrap gap-2 text-xs"></div>
      </div>
      <div className="flex flex-col place-items-end gap-2">
        <button onClick={handleHeartClick}>
          <Image
            src={
              !isLiked ? "/heart/heart_empty.svg" : "/heart/heart_filled.svg"
            }
            alt="하트"
            width={20}
            height={20}
          />
        </button>
        <Image
          src={"/logo/logo.png"}
          alt={item.id}
          width={70}
          height={70}
          className="h-[4.5rem] w-[4.5rem] rounded-sm border border-gray-200 object-contain"
        />
      </div>
    </div>
  );
}
