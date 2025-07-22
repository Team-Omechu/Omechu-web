"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FloatingActionButton from "@/components/common/FloatingActionButton";
import FoodCard from "@/components/common/FoodCard";
import Header from "@/components/common/Header";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import FoodReviewCard from "@/components/common/RestaurantReviewCard";
import SortSelector from "@/components/common/SortSelector";
import SelectTabBar from "@/components/mypage/SelectTabBar";
import { Restaurants } from "@/constant/restaurant/restaurantList";

import { MOCK_FOOD_REVIEW_CARD_DATA } from "./MOCK_FOOD_REVIEW_CARD_DATA";

export default function MyActivity() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState<"recommended" | "latest">(
    "recommended",
  );
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredItems = Restaurants;

  const visibleItems = filteredItems.slice(0, visibleCount);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const LODAING_TIMEOUT = 1800;

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      if (!target.isIntersecting || isLoading) return;

      setIsLoading(true);

      if (selectedIndex === 0) {
        // 리뷰 탭
        setVisibleCount((prev) =>
          Math.min(prev + 5, MOCK_FOOD_REVIEW_CARD_DATA.length),
        );
      } else if (selectedIndex === 1) {
        // 등록한 맛집 탭
        setVisibleCount((prev) => Math.min(prev + 5, filteredItems.length));
      }
    },
    [isLoading, selectedIndex, filteredItems.length],
  );

  useEffect(() => {
    if (selectedIndex !== 0 && selectedIndex !== 1) return; // 두 탭 모두 허용
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
  }, [observerCallback, selectedIndex]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, LODAING_TIMEOUT); // 1.8초 후 로딩 해제

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setVisibleCount(5);
  }, [selectedIndex]);

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

      <main
        ref={mainRef}
        className="flex min-h-screen w-full flex-col items-center overflow-auto px-2 pb-8 pt-3 scrollbar-hide"
      >
        {selectedIndex === 0 && (
          <>
            <section className="flex w-full justify-end gap-1 pb-3 pr-5 pt-1 text-sm text-[#828282]">
              {/* 필터 - 추천 순 | 최신 순 */}
              <SortSelector
                options={[
                  { label: "추천 순", value: "recommended" },
                  { label: "최신 순", value: "latest" },
                ]}
                selected={
                  sortOrder === "recommended" ? "recommended" : "latest"
                }
                onSelect={(value) =>
                  setSortOrder(value === "latest" ? "latest" : "recommended")
                }
              />
            </section>
            {/* 리뷰 카드 리스트 */}
            <section className="flex flex-col items-center gap-7">
              {MOCK_FOOD_REVIEW_CARD_DATA.slice()
                .sort((a, b) =>
                  sortOrder === "latest"
                    ? new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    : (b.recommendCount ?? 0) - (a.recommendCount ?? 0),
                )
                .slice(0, visibleCount)
                .map((review, idx) => (
                  <FoodReviewCard key={review.id} {...review} />
                ))}
            </section>
          </>
        )}
        {selectedIndex === 1 && (
          <>
            {/* 등록한 맛집 목록 */}
            <section className="mt-4 flex flex-col gap-5">
              {visibleItems.map((item, idx) => (
                <div key={item.id} className="flex flex-col">
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

        <div ref={loaderRef} className="h-[1px]" />

        {isLoading && <LoadingIndicator />}
        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />
      </main>
    </>
  );
}
