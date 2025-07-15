"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  const filteredItems = search.trim()
    ? foodItems.filter((item) => item.menu.includes(search.trim()))
    : foodItems;
  const visibleItems = filteredItems.slice(0, visibleCount);

  const similarItems = foodItems.filter(
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
      <main className="min-h-full w-full px-5 pb-8 pt-3">
        {/* 필터 - 최신 순 | 오래된 순 */}
        <section className="flex w-full justify-end gap-2 py-5 pr-1 text-sm text-[#828282]">
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

        <div ref={loaderRef} className="h-[1px]" />

        {isLoading && (
          <div className="mt-4 flex h-20 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
            <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
          </div>
        )}
      </main>
    </>
  );
}
