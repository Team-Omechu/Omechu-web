import FavoritesSection from "./FavoritesSection";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchHeartList } from "../api/favorites";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FoodCard from "@/components/common/FoodCard";
import Header from "@/components/common/Header";
import { likePlace, unlikePlace } from "../api/favorites";
import { useAuthStore } from "@/auth/store";
import { useProfile } from "../hooks/useProfile";

export default function Favorites() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [hearts, setHearts] = useState<any[]>([]);

  const user = useAuthStore((state) => state.user);

  const userId = user?.id ? Number(user.id) : undefined; // id가 string이면 변환, number면 그대로
  const { profile, loading, error: profileError } = useProfile(userId);
  const [minLoading, setMinLoading] = useState(true);

  console.log("[디버깅] user:", user);
  console.log("[디버깅] userId:", userId);

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

  //* dummy용
  // const filteredItems = search.trim()
  // ? Restaurants.filter((item) => item.menu.includes(search.trim()))
  // : Restaurants;

  // const sortedItems = [...filteredItems].sort((a, b) => {
  //   const aIdx = Restaurants.indexOf(a);
  //   const bIdx = Restaurants.indexOf(b);
  //   return sortOrder === "latest" ? bIdx - aIdx : aIdx - bIdx;
  // });

  // const visibleItems = sortedItems.slice(0, visibleCount);

  //* 실제 api 데이터 연동
  const filteredItems = search.trim()
    ? hearts.filter((item) =>
        item.signatureMenu?.join(",").includes(search.trim()),
      )
    : hearts;

  const sortedItems = [...filteredItems].sort((a, b) => {
    // 예: 최신순/오래된순을 id 또는 createdAt, placeId 등으로 구현
    // 여기선 placeId 사용(서버 데이터 기준)
    return sortOrder === "latest"
      ? b.placeId - a.placeId
      : a.placeId - b.placeId;
  });

  const visibleItems = sortedItems.slice(0, visibleCount);

  const handleLike = async (restaurantId: number) => {
    try {
      await likePlace(userId, restaurantId);
      // setHearts 갱신: 바로 UI에서 isLiked 상태 바꿔주거나 refetch
      setHearts((prev) =>
        prev.map((item) =>
          item.placeId === restaurantId ? { ...item, isLiked: true } : item,
        ),
      );
    } catch (e) {
      alert("찜 등록 실패");
    }
  };

  const handleUnlike = async (restaurantId: number) => {
    try {
      await unlikePlace(userId, restaurantId);
      // setHearts에서 해당 아이템만 isLiked: false 처리 (또는 리스트에서 제거)
      setHearts((prev) => prev.filter((item) => item.placeId !== restaurantId));
    } catch (e) {
      alert("찜 해제 실패");
    }
  };

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
      <main className="min-h-sceen w-full px-6 pb-8 pt-3">
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
                key={item.restaurantId}
                item={{
                  id: Number(item.restaurantId),
                  name: item.restaurant.name,
                  images: [], // 만약 이미지 있으면 item.restaurant.image 등으로
                  rating: item.restaurant.rating,
                  menu: "", // 필요시 추가
                  tags: [], // 필요시 추가
                  address: {
                    road: item.restaurant.address,
                    jibun: "",
                    postalCode: "",
                  },
                  reviews: 0,
                  isLiked: true,
                  category: "",
                  timetable: [],
                }}
                onClick={() =>
                  router.push(
                    `/restaurant/restaurant-detail/${item.restaurantId}`,
                  )
                }
                onLike={() => handleLike(Number(item.restaurantId))}
                onUnlike={() => handleUnlike(Number(item.restaurantId))}
              />
            ))}
          </div>
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
