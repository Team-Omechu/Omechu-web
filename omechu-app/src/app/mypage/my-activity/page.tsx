"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { distance } from "fastest-levenshtein";

import FoodCard from "@/app/components/common/FoodCard";
import FoodReviewCard from "@/app/components/common/FoodReveiwCard";
import Header from "@/app/components/common/Header";
import SelectTabBar from "@/app/components/mypage/SelectTabBar";
import { Restaurants } from "@/app/constant/restaurant/restaurantList2";

import { mockFoodReviewCardData } from "./mockFoodReviewData";

export default function MyActivity() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState<"Recommended" | "Latest">(
    "Recommended",
  );
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredItems = search.trim()
    ? Restaurants.filter((item) => item.menu.includes(search.trim()))
    : Restaurants;

  const similarItems = Restaurants.filter(
    (item) =>
      distance(item.menu, search.trim()) <= 2 && // 유사 거리 임계값 조정 가능
      !item.menu.includes(search.trim()), // 정확 검색에 이미 포함된 건 제외
  );

  const visibleItems = filteredItems.slice(0, visibleCount);

  return (
    <>
      <Header
        title={"활동 내역"}
        leftChild={
          <Link href={"/mypage"}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </Link>
        }
      />
      {/* 목록 정렬 탭 */}
      <SelectTabBar
        tabs={["리뷰", "등록한 맛집"]}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
      <main className="flex min-h-full w-full flex-col items-center px-2 pb-8 pt-3">
        {selectedIndex === 0 && (
          <>
            {/* 필터 - 추천 순 | 최신 순 */}
            <section className="flex w-full justify-end gap-1 pb-3 pr-5 pt-1 text-sm text-[#828282]">
              <button
                className={
                  sortOrder === "Recommended"
                    ? "font-semibold text-[#393939]"
                    : ""
                }
                onClick={() => setSortOrder("Recommended")}
              >
                추천 순
              </button>
              <span>|</span>
              <button
                className={
                  sortOrder === "Latest" ? "font-semibold text-[#393939]" : ""
                }
                onClick={() => setSortOrder("Latest")}
              >
                최신 순
              </button>
            </section>
            {/* 리뷰 카드 리스트 */}
            <section className="flex flex-col items-center gap-7">
              {mockFoodReviewCardData.map((review, idx) => (
                <FoodReviewCard key={idx} {...review} />
              ))}
            </section>
          </>
        )}
        {selectedIndex === 1 && (
          <>
            {/* 등록한 맛집 목록 */}
            <section className="mt-4 flex flex-col gap-5">
              {visibleItems.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <button className="w-full pb-0.5 pr-1 text-end text-sm font-normal text-[#828282]">
                    편집
                  </button>
                  <FoodCard
                    item={item}
                    onClick={() =>
                      router.push(`/restaurant/restaurant-detail/${item.id}`)
                    }
                  />
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </>
  );
}
