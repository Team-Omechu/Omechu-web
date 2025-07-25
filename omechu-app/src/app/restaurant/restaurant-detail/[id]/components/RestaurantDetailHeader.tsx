"use client";

import Image from "next/image";

interface RestaurantDetailHeaderProps {
  name: string;
  isLiked: boolean;
  onLikeClick: (e: React.MouseEvent) => void;
}

export default function RestaurantDetailHeader({
  name,
  isLiked,
  onLikeClick,
}: RestaurantDetailHeaderProps) {
  return (
    <div className="mb-5 mt-4 flex items-center justify-between gap-2">
      <h1 className="text-2xl font-bold text-gray-700">{name}</h1>
      <button onClick={onLikeClick}>
        <Image
          src={isLiked ? "/heart/heart_filled.svg" : "/heart/heart_empty.svg"}
          alt="하트"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
}
