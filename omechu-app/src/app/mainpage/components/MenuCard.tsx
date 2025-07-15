"use client";

import Image from "next/image";

interface MenuCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
  selected?: boolean; // 선택된 카드 여부
}

export default function MenuCard({
  title,
  description,
  image,
  onClick,
  selected = false,
}: MenuCardProps) {
  return (
    <div
      className="mt-2 relative cursor-pointer transition-all duration-150"
      onClick={onClick}
    >
      <div
        className={`border border-black rounded-md p-3 flex gap-3 items-center h-[100px] ${
          selected ? "bg-gray-200" : "bg-white"
        }`}
      >
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="rounded flex-shrink-0"
        />
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-[#1F9BDA] font-semibold">{title}</h3>
          <p className="text-sm text-[#828282] mt-1 leading-snug line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
