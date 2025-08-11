/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Image from "next/image";
import { Restaurant } from "@/lib/types/restaurant";

type FoodCardProps = {
  item: Restaurant;
  onClick: () => void;
  onLike?: () => void;
  onUnlike?: () => void;
};

export default function FoodCard({
  item,
  onClick,
  onLike,
  onUnlike,
}: FoodCardProps) {
  const [isLiked, setIsLiked] = useState(item.like ?? false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLiked) {
      // 찜 해제
      setIsLiked(false);
      isLiked && onUnlike && onUnlike();
    } else {
      // 찜 등록
      setIsLiked(true);
      isLiked && onLike && onLike();
    }
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
            {item.reviews !== undefined && (
              <span className="text-yellow-500">({item.reviews})</span>
            )}
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-500">{item.address}</p>
        {item.menus && (
          <p className="mb-1 text-sm font-bold text-blue-600">
            {item.menus[0]}
          </p>
        )}

        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          {item.rest_tag?.map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-blue-400 px-2 py-0.5 text-blue-400"
            >
              {tag.tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col place-items-end gap-2">
        <button onClick={handleLikeClick}>
          <img
            src={isLiked ? "/heart/heart_filled.svg" : "/heart/heart_empty.svg"}
            alt="하트"
            className="h-5 w-5"
          />
        </button>
        <img
          src={item.images?.[0] || "/logo/logo.png"}
          alt={item.menus[0] ?? "음식"}
          className="h-[4.5rem] w-[4.5rem] rounded-sm border border-gray-200 object-contain"
        />
      </div>
    </div>
  );
}
