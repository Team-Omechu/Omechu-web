/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchHeartList, likePlace, unlikePlace } from "../api/favorites";
import { useAuthStore } from "@/auth/store";

import Link from "next/link";
import { useRouter } from "next/navigation";

import FoodCard from "@/components/common/FoodCard";
import Header from "@/components/common/Header";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import SkeletonFoodCard from "@/components/common/SkeletonFoodCard";
import AuthErrorModal from "../AuthErrorModalSection";

export default function Favorites() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState(8);
  const [hearts, setHearts] = useState<any[]>([]);

  const user = useAuthStore((state) => state.user);
  const accessToken = user?.accessToken;

  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

  useEffect(() => {
    if (!hasHydrated) return;

    setModalOpen(false);

    if (!accessToken) {
      setModalOpen(true);
      setHearts([]);
      setIsInitialLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsInitialLoading(true);
      try {
        const data = await fetchHeartList();
        setHearts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (e?.response?.status === 401) setModalOpen(true);
        setHearts([]);
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchData();
  }, [hasHydrated, accessToken]);

  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  //* 실제 api 데이터 연동
  const filteredItems = (() => {
    const q = search.trim().toLowerCase();
    if (!q) return hearts;
    return hearts.filter((item) => {
      const name = (item.restaurant?.name ?? "").toLowerCase();
      const menus: string[] = item.restaurant?.representativeMenus ?? [];
      const menuHit = menus.some((m: string) =>
        (m ?? "").toLowerCase().includes(q),
      );
      return name.includes(q) || menuHit;
    });
  })();

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aid = Number(a.restaurant.id);
    const bid = Number(b.restaurant.id);
    return sortOrder === "latest" ? bid - aid : aid - bid;
  });

  const visibleItems = sortedItems.slice(0, visibleCount);

  useEffect(() => {
    if (visibleCount > hearts.length) {
      setVisibleCount(hearts.length);
    }
  }, [hearts.length]);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_FETCH = 6;

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        !isLoading &&
        visibleCount < filteredItems.length
      ) {
        setIsLoading(true);
        setVisibleCount((prev) =>
          Math.min(prev + ITEMS_PER_FETCH, filteredItems.length),
        );
        // setIsLoading(false);
      }
    },
    [isLoading, visibleCount, filteredItems.length],
  );

  // 데이터 증가 후 isLoading을 해제
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1800); // 1.8초 후 로딩 해제

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

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
      observer.disconnect();
    };
  }, [observerCallback]);

  // Reset visibleCount when search changes so infinite scroll starts from the top
  useEffect(() => {
    setVisibleCount((prev) => Math.min(8, filteredItems.length));
  }, [search]);

  const isRefreshingRef = useRef(false);

  const refreshHearts = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    try {
      const data = await fetchHeartList();
      setHearts(Array.isArray(data) ? data : []);
      // 현재 개수보다 줄었으면 visibleCount 보정
      setVisibleCount((prev) => Math.min(prev, data?.length ?? 0));
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  const handleLike = async (restaurantId: number) => {
    // 1) 낙관적 반영 (UI 즉시)
    setHearts(
      (prev) =>
        prev.some((h) => Number(h.restaurant.id) === restaurantId)
          ? prev.map((h) =>
              Number(h.restaurant.id) === restaurantId
                ? { ...h, isLiked: true }
                : h,
            )
          : prev, // (찜 목록 페이지라면 보통 이미 존재. 다른 페이지에서 들어오는 케이스면 새 카드 push 로직 추가)
    );

    try {
      await likePlace(restaurantId);
    } catch (e) {
      // 실패 시 롤백
      setHearts((prev) =>
        prev.map((h) =>
          Number(h.restaurant.id) === restaurantId
            ? { ...h, isLiked: false }
            : h,
        ),
      );
      alert("찜 등록 실패");
      return;
    }

    // 2) 서버 최신 상태로 동기화(리스트 재로딩)
    refreshHearts();
  };

  const handleUnlike = async (restaurantId: number) => {
    // 1) 낙관적 반영 (UI 즉시 제거)
    setHearts((prev) => {
      const next = prev.filter((h) => Number(h.restaurant.id) !== restaurantId);
      setVisibleCount((v) => Math.min(v, next.length));
      return next;
    });

    try {
      await unlikePlace(restaurantId);
    } catch (e) {
      // 실패 시 롤백: 서버 상태 다시 받아와서 복구
      alert("찜 해제 실패");
      refreshHearts();
      return;
    }

    // 2) 서버 최신 상태로 동기화
    refreshHearts();
  };

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
          {isInitialLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonFoodCard key={i} />
              ))}
            </div>
          ) : (
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
          )}
        </section>

        <div ref={loaderRef} className="h-[1px]" />
        {isLoading && <LoadingIndicator />}
        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />
        {modalOpen && (
          <AuthErrorModal
            onConfirm={() => {
              setModalOpen(false);
              router.push("/sign-in");
            }}
            onClose={() => setModalOpen(false)}
          />
        )}
      </main>
    </>
  );
}
