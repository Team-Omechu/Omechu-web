"use client";

import { useState } from "react";

import Image from "next/image";

interface RestaurantCardProps {
  name: string;
  rating: number;
  reviews: number;
  address: string;
  menu: string;
  tags: string[];
  image: string;
}

export default function RestaurantCard({
  name,
  rating,
  reviews,
  address,
  menu,
  tags,
  image,
}: RestaurantCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <div className="relative flex items-start gap-4 rounded-md border border-black bg-white p-4">
      {/* 즐겨찾기 아이콘 */}
      <button
        className="absolute right-2 top-2 text-lg"
        onClick={() => setIsLiked((prev) => !prev)}
      >
        {isLiked ? "❤️" : "🤍"}
      </button>

      {/* 정보 영역 */}
      <div className="flex-1">
        <div className="flex items-center">
          <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
          <div className="ml-1 flex items-center font-medium text-[#FFCF2E]">
            |★ {rating}
            <span className="ml-1 text-gray-500">({reviews})</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-600">{address}</p>

        {/* 메뉴 태그 */}
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="w-full px-2 text-xs text-[#1F98DA]">{menu}</span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-[#1F98DA]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 이미지 */}
      <div className="mt-10 flex-shrink-0">
        <Image
          src={image}
          alt={name}
          width={50}
          height={100}
          className="h-full w-full rounded-md object-cover"
        />
      </div>
    </div>
  );
}
