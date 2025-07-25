"use client";

import dynamic from "next/dynamic";

const KakaoMap = dynamic(() => import("./KakaoMap"), { ssr: false });

interface Props {
  latitude: number;
  longitude: number;
  name: string;
}

export default function RestaurantMapPreview({
  latitude,
  longitude,
  name,
}: Props) {
  return (
    <div className="mt-4 h-[20rem] w-[21rem] rounded-xl shadow-md">
      <KakaoMap latitude={latitude} longitude={longitude} name={name} />
    </div>
  );
}
