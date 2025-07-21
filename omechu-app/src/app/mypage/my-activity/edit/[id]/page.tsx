"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import RestaurantEditModal from "@/app/components/restaurant/RestaurantAddModal/RestaurantEditModal";

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
  const { id } = useParams();
  console.log("id", id);
  const router = useRouter();

  const [initialData, setInitialData] = useState<RestaurantData | null>(null);

  useEffect(() => {
    if (!id) return;

    const numericId = Number(id);
    const data = initialRestaurantData.find((item) => item.id === numericId);

    console.log("initialRestaurantData", initialRestaurantData);
    console.log("numericId", numericId);

    if (data) {
      // id를 제외한 나머지만 전달
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
      console.warn("해당 맛집을 찾을 수 없습니다.");
      router.back();
    }
  }, [id, router]);

  if (!initialData) return null;

  return (
    <RestaurantEditModal
      onClose={() => router.back()}
      initialData={initialData}
    />
  );
}
