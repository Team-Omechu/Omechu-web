"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import RestaurantEditModal from "@/components/restaurant/RestaurantAddModal/RestaurantEditModal";

import initialRestaurantData from "./INITIAL_RESTAURANT_DATA";

interface RestaurantData {
  restaurantName: string;
  menus: string[];
  selectedDays: string[];
  startTime: string;
  endTime: string;
  address: string;
  detailAddress: string;
  imageUrl: string;
}

export default function RestaurantEditPage() {
  const params = useParams();
  const router = useRouter();

  const [initialData, setInitialData] = useState<RestaurantData | null>(null);

  useEffect(() => {
    const rawId = params?.id;
    const numericId = Number(Array.isArray(rawId) ? rawId[0] : rawId);

    if (!numericId || isNaN(numericId)) {
      console.warn("올바르지 않은 ID입니다.");
      router.back();
      return;
    }

    const data = initialRestaurantData.find((item) => item.id === numericId);

    if (data) {
      const {
        restaurantName,
        menus,
        selectedDays,
        startTime,
        endTime,
        address,
        detailAddress,
        imageUrl,
      } = data;

      setInitialData({
        restaurantName,
        menus,
        selectedDays,
        startTime,
        endTime,
        address,
        detailAddress,
        imageUrl,
      });
    } else {
      console.warn("해당 ID의 맛집이 존재하지 않습니다.");
      router.back();
    }
  }, [params, router]);

  if (!initialData) return <div>로딩 중...</div>;

  return (
    <RestaurantEditModal
      onClose={() => router.back()}
      initialData={initialData}
    />
  );
}
