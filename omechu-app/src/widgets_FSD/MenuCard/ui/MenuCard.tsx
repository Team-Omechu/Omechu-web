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
        className={`border-grey-dark-hover flex h-[110px] items-center gap-3 rounded-md border p-3 ${
          selected ? "bg-gray-200" : "bg-white"
        }`}
      >
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="shrink-0 rounded-sm"
        />
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="text-secondary-normal font-semibold">{title}</h3>
          <p className="text-grey-normal-active mt-1 line-clamp-2 text-sm leading-snug">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
