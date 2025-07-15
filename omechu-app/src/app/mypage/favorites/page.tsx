"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { distance } from "fastest-levenshtein";

import FoodCard from "@/app/components/common/FoodCard";
import Header from "@/app/components/common/Header";
import { foodItems } from "@/app/constant/restautantFoodList"; // 음식 데이터

export default function Favorites() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [visibleCount, setVisibleCount] = useState(8);

  const filteredItems = search.trim()
    ? foodItems.filter((item) => item.menu.includes(search.trim()))
    : foodItems;
  const visibleItems = filteredItems.slice(0, visibleCount);

  const similarItems = foodItems.filter(
    (item) =>
      distance(item.menu, search.trim()) <= 2 && // 유사 거리 임계값 조정 가능
      !item.menu.includes(search.trim()), // 정확 검색에 이미 포함된 건 제외
  );

  return (
    <>
      <Header
        title={"찜 목록"}
        leftChild={
          <Link href={"/mypage"}>
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </Link>
        }
      />
      <main className="h-full w-full px-5 pb-8 pt-3">
        {/* 필터 - 최신 순 | 오래된 순 */}
        <section></section>

        {/* 찜 목록 */}
        <section className="flex flex-col gap-3">
          {visibleItems.map((item, idx) => (
            <FoodCard
              key={idx}
              item={item}
              onClick={() =>
                router.push(
                  `/restaurant/restaurant-detail?menu=${encodeURIComponent(item.menu)}`,
                )
              }
            />
          ))}
        </section>
      </main>
    </>
  );
}
