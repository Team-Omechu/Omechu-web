/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchHeartList } from "../api/favorites";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FoodCard from "@/components/common/FoodCard";
import Header from "@/components/common/Header";
import { likePlace, unlikePlace } from "../api/favorites";
import { useAuthStore } from "@/auth/store";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import SkeletonFoodCard from "@/components/common/SkeletonFoodCard";

export default function Favorites() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [hearts, setHearts] = useState<any[]>([]);

  const user = useAuthStore((state) => state.user);

  const userId = user?.id ? Number(user.id) : undefined;

  // 예시: 서버 응답이 비정상일 때 기본값을 빈 배열로!
  useEffect(() => {
    if (!userId) {
      setHearts([]);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchHeartList(userId);
        if (!Array.isArray(data)) {
          setHearts([]);
          return;
        }
        setHearts(data);
      } catch (e) {
        setHearts([]);
      }
    };
    fetchData();
  }, [userId]);

  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  //* 실제 api 데이터 연동
  const filteredItems = search.trim()
    ? hearts.filter((item) =>
        item.signatureMenu?.join(",").includes(search.trim()),
      )
    : hearts;

  const sortedItems = [...filteredItems].sort((a, b) => {
    return sortOrder === "latest"
      ? b.restaurant.id - a.restaurant.id
      : a.restaurant.id - b.restaurant.id;
  });

  const visibleItems = sortedItems.slice(0, visibleCount);

  useEffect(() => {
    if (visibleCount > hearts.length) {
      setVisibleCount(hearts.length);
    }
  }, [hearts.length]);

  const handleLike = async (restaurantId: number) => {
    try {
      await likePlace(userId, restaurantId);
      // setHearts 갱신: 바로 UI에서 isLiked 상태 바꿔주거나 refetch
      setHearts((prev) =>
        prev.map((item) =>
          item.restaurant.id === restaurantId
            ? { ...item, isLiked: true }
            : item,
        ),
      );
    } catch (e) {
      alert("찜 등록 실패");
    }
  };

  const handleUnlike = async (restaurantId: number) => {
    try {
      await unlikePlace(userId, restaurantId);
      setHearts((prevHearts) => {
        const newHearts = prevHearts.filter(
          (item) => item.restaurant.id !== restaurantId,
        );
        setVisibleCount((prevVisible) =>
          Math.min(prevVisible, newHearts.length),
        );
        return newHearts;
      });
    } catch (e) {
      alert("찜 해제 실패");
    }
  };

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_FETCH = 5;

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      if (
        target.isIntersecting &&
        !isLoading &&
        visibleCount < filteredItems.length
      ) {
        setIsLoading(true); // 로딩 상태 시작
        setVisibleCount((prev) =>
          Math.min(prev + ITEMS_PER_FETCH, filteredItems.length),
        ); // 다음 항목 5개 추가
      }
    },
    [isLoading, visibleCount, filteredItems.length],
  );

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // IntersectionObserver 등록 및 해제
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

  return (
    <>
      <Header
        title={"찜 목록"}
        leftChild={
          <Link href={"/mypage"}>
            <img
              src={"/arrow/left-header-arrow.svg"}
              // alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </Link>
        }
      />
      <main
        ref={mainRef}
        className="relative h-[calc(100dvh-3rem)] w-full overflow-y-auto px-6 pb-8 pt-3 scrollbar-hide"
      >
        {/* 필터 - 최신 순 | 오래된 순 */}
        <section className="flex w-full justify-end gap-1 pb-3 pr-1 pt-2 text-sm text-grey-normalActive">
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
            {visibleItems.map((item) => (
              <FoodCard
                key={item.restaurant.id}
                item={{
                  id: Number(item.restaurant.id),
                  name: item.restaurant.name,
                  images: item.restaurant.rest_image
                    ? [item.restaurant.rest_image]
                    : [], // 단일 이미지라도 배열로
                  rating: item.restaurant.rating ?? 0,
                  menu: item.restaurant.representativeMenus?.[0] ?? "", // 대표 메뉴가 있을 때 첫 번째만
                  tags: Array.isArray(item.restaurant.tags)
                    ? item.restaurant.tags.map((tagObj: any) => tagObj.tag)
                    : [],
                  address: {
                    road: item.restaurant.address ?? "",
                    jibun: "",
                    postalCode: "",
                  },
                  reviews: item.restaurant.reviewCount ?? 0,
                  isLiked: true,
                  category: "",
                  timetable: [],
                }}
                onClick={() =>
                  router.push(
                    `/restaurant/restaurant-detail/${item.restaurant.id}`,
                  )
                }
                onLike={() => handleLike(Number(item.restaurant.id))}
                onUnlike={() => handleUnlike(Number(item.restaurant.id))}
              />
            ))}
          </div>
        </section>

        <div ref={loaderRef} className="h-[1px]" />
        {isLoading && <LoadingIndicator />}
        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />
      </main>
    </>
  );
}
