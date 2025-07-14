"use client";

import Image from "next/image";
import { useState } from "react";

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
  const [isLiked, setIsLiked]=useState(false);
  return (
    <div className="relative bg-white border border-black rounded-md p-4 flex items-start gap-4">
      {/* 즐겨찾기 아이콘 */}
      <button className="absolute top-2 right-2 text-lg"
      onClick={()=>setIsLiked((prev)=>!prev)}>
        {isLiked? "❤️" : "🤍"}
      </button>

      {/* 정보 영역 */}
      <div className="flex-1">
        <div className="flex items-center">
          <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
          <div className="flex items-center text-[#FFCF2E] font-medium ml-1">
             |★ {rating}
            <span className="text-gray-500 ml-1">({reviews})</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-1">{address}</p>

        {/* 메뉴 태그 */}
            <div className="flex flex-wrap gap-2 mt-2">
            <span className="w-full px-2 text-xs text-[#1F98DA]">
                {menu}
            </span>
            {tags.map((tag) => (
                <span
                key={tag}
                className="px-2 py-1 text-xs bg-blue-100 text-[#1F98DA] rounded-full"
                >
                {tag}
                </span>
            ))}
            </div>
      </div>

      {/* 이미지 */}
      <div className="flex-shrink-0 mt-10">
        <Image
          src={image}
          alt={name}
          width={50}
          height={100}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </div>
  );
}
