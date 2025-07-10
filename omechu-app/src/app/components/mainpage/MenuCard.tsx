// components/MenuCard.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

interface MenuCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void
}

export default function MenuCard({ title, description, image }: MenuCardProps) {
  return (
    <div className="mt-3 relative cursor-pointer">
      <button className="absolute -top-3 left-1 z-10">
        <Image src="/do_not_disturb_on.png" alt="icon" width={30} height={30} className="bg-white rounded-full" />
      </button>
      <div className="bg-white border border-black rounded-md p-3 flex gap-3 items-center">
      <Image src={"/logo_3d.png"} alt={title} width={80} height={80} className="rounded" />
      <div className="flex-1">
        <h3 className="text-[#1F9BDA] font-semibold">{title}</h3>
        <p className="text-sm text-[#828282] mt-1">{description}</p>
      </div>
      </div>
    </div>
  );
}
