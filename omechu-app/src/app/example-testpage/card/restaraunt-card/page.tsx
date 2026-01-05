"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import RestaurantCard from "@/shared_FSD/ui/card/RestaurantCard";

const mockRestaurants = [
  {
    id: 1,
    name: "황톳길",
    distance: "500",
    category: "중식",
    price: "10,000~20,000",
    address: "서울 마포구 공덕동 270-1",
  },
  {
    id: 2,
    name: "사보텐사보텐사보텐",
    distance: "320",
    category: "일식",
    price: "12,000~25,000",
    address:
      "서울 마포구 백범로 35서울 마포구 백범로 35서울 마포구 백범로 35서울 마포구 백범로 35",
  },
  {
    id: 3,
    name: "라멘신",
    distance: "780",
    category: "일식",
    price: "9,000~15,000",
    address: "서울 마포구 서강로 18",
  },
];

export default function RestaurantCardTestPage() {
  const router = useRouter();

  return (
    <main
      className="mt-9 flex min-h-screen w-full flex-col items-center gap-6"
      role="main"
      aria-labelledby="page-title"
    >
      <h1 id="page-title" className="sr-only">
        맛집 카드 테스트 페이지
      </h1>

      {mockRestaurants.map((r) => (
        <RestaurantCard
          key={r.id}
          {...r}
          onCardClick={() => router.push(`/restaurant/${r.id}`)}
        />
      ))}
    </main>
  );
}
