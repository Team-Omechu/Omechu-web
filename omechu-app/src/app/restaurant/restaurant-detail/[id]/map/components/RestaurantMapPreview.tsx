"use client";

import dynamic from "next/dynamic";

const KakaoMap = dynamic(() => import("./KakaoMap"), { ssr: false });

interface Props {
  latitude: number;
  longitude: number;
  name: string;
  className?: string;
  radiusKm?: number;
}

export default function RestaurantMapPreview({
  latitude,
  longitude,
  name,
  className,
  radiusKm,
}: Props) {
  return (
    <div
      className={`mt-4 overflow-hidden rounded-xl shadow-md ${className ?? ""}`}
    >
      <KakaoMap
        latitude={latitude}
        longitude={longitude}
        name={name}
        radiusKm={radiusKm}
      />
    </div>
  );
}
