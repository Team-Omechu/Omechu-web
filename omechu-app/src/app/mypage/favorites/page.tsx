/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchHeartList } from "../api/favorites";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { distance } from "fastest-levenshtein";

import FoodCard from "@/components/common/FoodCard";
import Header from "@/components/common/Header";
import { Restaurants } from "@/constant/restaurant/restaurantList"; // 음식 데이터

export default function Favorites() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [hearts, setHearts] = useState<any[]>([]);

  const userId = 1;

  // 예시: 서버 응답이 비정상일 때 기본값을 빈 배열로!
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHeartList(userId);
        // 1. 배열인지 체크 (서버 에러 포함)
        if (!Array.isArray(data)) {
          setHearts([]); // 배열이 아니면 무조건 빈 배열!
          return;
        }
        setHearts(data); // 배열일 때만 정상 저장
      } catch (e) {
        setHearts([]); // 네트워크/기타 에러도 빈 배열로!
      }
    };
    fetchData();
  }, []);

  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  //* dummy용
  const filteredItems = search.trim()
    ? Restaurants.filter((item) => item.menu.includes(search.trim()))
    : Restaurants;

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aIdx = Restaurants.indexOf(a);
    const bIdx = Restaurants.indexOf(b);
    return sortOrder === "latest" ? bIdx - aIdx : aIdx - bIdx;
  });

  const visibleItems = sortedItems.slice(0, visibleCount);

  //* 실제 api 데이터 연동
  // const filteredItems = search.trim()
  //   ? hearts.filter((item) =>
  //       item.signatureMenu?.join(",").includes(search.trim()),
  //     )
  //   : hearts;

  // const sortedItems = [...filteredItems].sort((a, b) => {
  //   // 예: 최신순/오래된순을 id 또는 createdAt, placeId 등으로 구현
  //   // 여기선 placeId 사용(서버 데이터 기준)
  //   return sortOrder === "latest"
  //     ? b.placeId - a.placeId
  //     : a.placeId - b.placeId;
  // });

  // const visibleItems = sortedItems.slice(0, visibleCount);

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
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </Link>
        }
      />
      <main className="w-full px-6 pt-3 pb-8 min-h-sceen">
        {/* 필터 - 최신 순 | 오래된 순 */}
        <section className="flex justify-end w-full gap-1 pt-2 pb-3 pr-1 text-sm text-grey-normalActive">
          <button
            className={
              sortOrder === "latest" ? "font-semibold text-grey-darker" : ""
            }
            onClick={() => setSortOrder("latest")}
          >
            최신 순
          </button>
          <span>|</span>
          <button
            className={
              sortOrder === "oldest" ? "font-semibold text-grey-darker" : ""
            }
            onClick={() => setSortOrder("oldest")}
          >
            오래된 순
          </button>
        </section>

        {/* 찜 목록 */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {/* {visibleItems.map((item, idx) => (
              <FoodCard
                key={idx}
                item={item}
                onClick={() =>
                  router.push(`/restaurant/restaurant-detail/${item.id}`)
                }
              />
            ))} */}
            {visibleItems.map((item) => (
              <FoodCard
                key={item.placeId}
                item={{
                  id: item.placeId,
                  name: item.placeName,
                  images: [item.placeImageUrl],
                  rating: item.placePoint,
                  menu: item.signatureMenu?.[0] ?? "",
                  tags: item.summary ?? [],
                  address: {
                    road: item.address,
                    jibun: "",
                    postalCode: "",
                  },
                  reviews: 0, // 없으면 0, 필요 시 API 수정
                  isLiked: true, // 찜 목록 -> true
                  category: "", // 카테고리 없으면 빈 값
                  timetable: [], // 없음 -> 빈 배열
                }}
                onClick={() =>
                  router.push(`/restaurant/restaurant-detail/${item.placeId}`)
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
