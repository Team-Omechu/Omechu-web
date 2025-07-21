"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import RestaurantEditModal from "@/app/components/restaurant/RestaurantAddModal/RestaurantEditModal";
import initialRestaurantData, {
  RestaurantInitialData,
} from "./INITIAL_RESTAURANT_DATA";

// id 제외한 타입
type RestaurantData = Omit<RestaurantInitialData, "id">;

export default function RestaurantEditPage() {
  const params = useParams();
  const router = useRouter();

  const [initialData, setInitialData] = useState<RestaurantData | null>(null);

  useEffect(() => {
    const rawId = params?.id;
    const numericId = Number(Array.isArray(rawId) ? rawId[0] : rawId);

    if (isNaN(numericId)) {
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
      console.warn("해당 맛집을 찾을 수 없습니다.");
      router.back();
    }
  }, [params, router]);

  if (!initialData) return null;

  return (
    <RestaurantEditModal
      onClose={() => router.back()}
      initialData={initialData}
    />
  );
}