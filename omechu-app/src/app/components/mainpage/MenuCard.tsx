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
    <div className="mt-3 relative cursor-pointer">
      <div className="bg-white border border-black rounded-md p-3 flex gap-3 items-center">
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="rounded"
        />
        <div className="flex-1">
          <h3 className="text-[#1F9BDA] font-semibold">{title}</h3>
          <p className="text-sm text-[#828282] mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
