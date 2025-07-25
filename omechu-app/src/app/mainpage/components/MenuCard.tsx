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
      className="relative mt-2 cursor-pointer transition-all duration-150"
      onClick={onClick}
    >
      <div
        className={`flex h-[110px] items-center gap-3 rounded-md border border-black p-3 ${
          selected ? "bg-gray-200" : "bg-white"
        }`}
      >
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="flex-shrink-0 rounded"
        />
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="font-semibold text-secondary-normal">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-snug text-[#828282]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
