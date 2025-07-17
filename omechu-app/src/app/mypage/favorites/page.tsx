"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { distance } from "fastest-levenshtein";

import FoodCard from "@/app/components/common/FoodCard";
import Header from "@/app/components/common/Header";
import { Restaurants } from "@/app/constant/restaurant/restaurantList2"; // 음식 데이터

export default function Favorites() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  const filteredItems = search.trim()
    ? Restaurants.filter((item) => item.menu.includes(search.trim()))
    : Restaurants;

  const similarItems = Restaurants.filter(
    (item) =>
      distance(item.menu, search.trim()) <= 2 && // 유사 거리 임계값 조정 가능
      !item.menu.includes(search.trim()), // 정확 검색에 이미 포함된 건 제외
  );

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      if (
        target.isIntersecting &&
        !isLoading &&
        visibleCount < filteredItems.length
      ) {
        setIsLoading(true); // 로딩 상태 시작
        setVisibleCount((prev) => Math.min(prev + 18, filteredItems.length)); // 다음 항목 18개 추가
      }
    },
    [isLoading, visibleCount, filteredItems.length],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null, // 뷰포트를 기준으로 관찰
      rootMargin: "0px 0px 160px 0px", // 하단 여백 확보 (BottomNav 높이 고려)
      threshold: 0, // 요소가 조금이라도 보이면 콜백 실행
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [observerCallback]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1800); // 1.8초 후 로딩 해제

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aIdx = Restaurants.indexOf(a);
    const bIdx = Restaurants.indexOf(b);
    return sortOrder === "latest" ? bIdx - aIdx : aIdx - bIdx;
  });

  const visibleItems = sortedItems.slice(0, visibleCount);

  return (
    <>
      <Header
        title={"찜 목록"}
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
      <main className="w-full min-h-full px-6 pt-3 pb-8">
        {/* 필터 - 최신 순 | 오래된 순 */}
        <section className="flex w-full justify-end gap-1 pb-3 pr-1 pt-2 text-sm text-[#828282]">
          <button
            className={
              sortOrder === "latest" ? "font-semibold text-[#393939]" : ""
            }
            onClick={() => setSortOrder("latest")}
          >
            최신 순
          </button>
          <span>|</span>
          <button
            className={
              sortOrder === "oldest" ? "font-semibold text-[#393939]" : ""
            }
            onClick={() => setSortOrder("oldest")}
          >
            오래된 순
          </button>
        </section>

        {/* 찜 목록 */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {visibleItems.map((item, idx) => (
              <FoodCard
                key={idx}
                item={item}
                onClick={() =>
                  router.push(`/restaurant/restaurant-detail/${item.id}`)
                }
              />
            ))}
          </div>
        </section>

        <div ref={loaderRef} className="h-[1px]" />

        {isLoading && (
          <div className="flex items-center justify-center h-20 mt-4">
            <div className="w-6 h-6 border-4 border-gray-300 rounded-full animate-spin border-t-gray-800" />
            <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
          </div>
        )}
      </main>
    </>
  );
}
