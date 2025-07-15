// components/MenuCard.tsx
"use client";

import Image from "next/image";

interface MenuCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}

export default function MenuCard({ title, description, image }: MenuCardProps) {
  return (
    <div className="relative mt-3 cursor-pointer">
      <div className="flex items-center gap-3 rounded-md border border-black bg-white p-3">
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="rounded"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-[#1F9BDA]">{title}</h3>
          <p className="mt-1 text-sm text-[#828282]">{description}</p>
        </div>
      </div>
    </div>
  );
}
