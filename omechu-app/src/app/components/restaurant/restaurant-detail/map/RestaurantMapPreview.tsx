"use client";

import Image from "next/image";

interface RestaurantMapPreviewProps {
  mapImagePath: string;
  restaurantName: string;
}

export default function RestaurantMapPreview({
  mapImagePath,
  restaurantName,
}: RestaurantMapPreviewProps) {
  return (
    <section className="flex w-full items-center justify-center">
      <div className="h-80 w-80 overflow-hidden border-2 border-[#00A3FF]">
        <Image
          src={mapImagePath}
          alt={`${restaurantName} 지도`}
          width={330}
          height={330}
        />
      </div>
    </section>
  );
}
