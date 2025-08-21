/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchHeartList, likePlace, unlikePlace } from "../api/favorites";
import { useAuthStore } from "@/lib/stores/auth.store";

import Link from "next/link";
import { useRouter } from "next/navigation";

import FoodCard from "@/components/common/FoodCard";
import Header from "@/components/common/Header";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import SkeletonFoodCard from "@/components/common/SkeletonFoodCard";
import AuthErrorModal from "../AuthErrorModalSection";
import AuthErrorModalSection from "../AuthErrorModalSection";

export default function Favorites() {
  // 라우터/DOM 참조
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 화면 상태
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 인피니트 스크롤 로딩 플래그
  const [isInitialLoading, setIsInitialLoading] = useState(true); // 최초 진입 로딩(스켈레톤)
  const [modalOpen, setModalOpen] = useState(false);

  // 데이터/뷰 범위
  const [hearts, setHearts] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(8); // 현재 화면에 노출할 개수
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  // 인증 관련 (zustand)
  // const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore.getState().accessToken;
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false; // 스토리지 복원 완료 여부

  // 1) 최초/재인증 로드: 하이드레이션 후, 토큰 없으면 모달/초기화, 있으면 목록 패치
  useEffect(() => {
    if (!hasHydrated) return;

    // 모달 초기화
    setModalOpen(false);

    // 토큰 없으면 인증 모달 노출 + 초기 로딩 종료
    if (!accessToken) {
      setModalOpen(true);
      setHearts([]);
      setIsInitialLoading(false);
      return;
    }

    // 토큰 있으면 찜 목록 패치
    const fetchData = async () => {
      setIsInitialLoading(true);
      try {
        const data = await fetchHeartList();
        setHearts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        // 인증 만료 등
        if (e?.response?.status === 401) setModalOpen(true);
        setHearts([]);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, [hasHydrated, accessToken]);

  // 2) 검색/정렬 필터링
  //  - search: 입력값 기준 이름/대표메뉴 히트
  //  - sortOrder: 최신/오래된 순 정렬
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

  // 정렬 기준: 찜한 시점 우선(createdAt/likedAt/updatedAt) → 없으면 id
  const getSortTs = (h: any) => {
    const ts =
      h?.createdAt ||
      h?.likedAt ||
      h?.updatedAt ||
      h?.restaurant?.createdAt ||
      h?.restaurant?.updatedAt ||
      null;
    const n = ts ? new Date(ts).getTime() : NaN;
    if (!Number.isNaN(n)) return n;
    // fallback: 숫자 id
    const id = Number(h?.id ?? h?.restaurant?.id ?? 0);
    return Number.isFinite(id) ? id : 0;
  };

  const sortedItems = useMemo(() => {
    const base = filteredItems; // 검색 필터 결과 기준으로 정렬
    return [...base].sort((a, b) => {
      const at = getSortTs(a);
      const bt = getSortTs(b);
      return sortOrder === "latest" ? bt - at : at - bt;
    });
  }, [filteredItems, sortOrder]);

  // 중복 제거 추가
  const dedupedItems = useMemo(() => {
    const seen = new Set<string>();
    return sortedItems.filter((h) => {
      const key = String(h?.restaurant?.id ?? h?.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [sortedItems]);

  const visibleItems = useMemo(() => {
    return dedupedItems.slice(0, visibleCount);
  }, [dedupedItems, visibleCount]);

  // hearts 길이가 줄었을 때 visibleCount가 남지 않도록 보정
  useEffect(() => {
    if (visibleCount > hearts.length) {
      setVisibleCount(hearts.length);
    }
  }, [hearts.length, visibleCount]);

  // 3) 인피니트 스크롤: 관찰 콜백
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
      }
    },
    [isLoading, visibleCount, filteredItems.length],
  );

  // 인피니트 스크롤: observer 등록/해제
  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null, // viewport 기준
      rootMargin: "0px 0px 160px 0px", // 하단 여백(하단 UI 고려)
      threshold: 0,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [observerCallback]);

  // 인피니트 스크롤: 로딩 플래그 해제 타이머
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setIsLoading(false), 1800); // 1.8초 후 해제
    return () => clearTimeout(timer);
  }, [isLoading]);

  // 검색어가 바뀌면 리스트 상단부터 다시 보이도록 초기 개수 리셋
  useEffect(() => {
    setVisibleCount((prev) => Math.min(8, filteredItems.length));
  }, [search, filteredItems.length]);

  // 상단 이동
  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 4) 서버 동기화: 하트 목록 최신화
  const isRefreshingRef = useRef(false);
  const refreshHearts = useCallback(async () => {
    if (isRefreshingRef.current) return; // 중복 호출 방지
    isRefreshingRef.current = true;
    try {
      const data = await fetchHeartList();
      setHearts(Array.isArray(data) ? data : []);
      // 현재 보이는 개수보다 총 개수가 줄었다면 visibleCount 보정
      setVisibleCount((prev) => Math.min(prev, data?.length ?? 0));
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // 5) 좋아요/해제 이벤트 (낙관적 업데이트 → 실패시 롤백 → 서버 동기화)
  const handleLike = async (restaurantId: number) => {
    // 낙관적 반영: 이미 존재한다는 전제 하에 isLiked 토글
    setHearts((prev) =>
      prev.some((h) => Number(h.restaurant.id) === restaurantId)
        ? prev.map((h) =>
            Number(h.restaurant.id) === restaurantId
              ? { ...h, isLiked: true }
              : h,
          )
        : prev,
    );

    try {
      await likePlace(restaurantId);
    } catch {
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

    // 서버 최신 상태로 동기화
    refreshHearts();
  };

  const handleUnlike = async (restaurantId: number) => {
    // 낙관적 반영: 바로 제거
    setHearts((prev) => {
      const next = prev.filter((h) => Number(h.restaurant.id) !== restaurantId);
      setVisibleCount((v) => Math.min(v, next.length)); // 보이는 개수 보정
      return next;
    });

    try {
      await unlikePlace(restaurantId);
    } catch {
      // 실패 시 서버 상태로 복구
      alert("찜 해제 실패");
      refreshHearts();
      return;
    }

    // 서버 최신 상태 반영
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
            onClick={() => {
              setSortOrder("latest");
              setVisibleCount((prev) => Math.min(8, filteredItems.length));
            }}
          >
            최신 순
          </button>
          <span>|</span>
          <button
            className={
              sortOrder === "oldest" ? "font-semibold text-grey-darker" : ""
            }
            onClick={() => {
              setSortOrder("oldest");
              setVisibleCount((prev) => Math.min(8, filteredItems.length));
            }}
          >
            오래된 순
          </button>
        </section>
        {/* 찜 목록 */}
        <section className="flex flex-col gap-4">
          {isInitialLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
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
                    menus: item.restaurant.representativeMenus ?? [], // 대표 메뉴가 있을 때 첫 번째만
                    rest_tag: Array.isArray(item.restaurant.tags)
                      ? item.restaurant.tags.map((tagObj: any) => tagObj.tag)
                      : [],
                    address: item.restaurant.address ?? "",
                    reviews: item.restaurant.reviewCount ?? 0,
                    like: true,
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
          <AuthErrorModalSection
            isOpen={modalOpen}
            onConfirm={() => {
              setModalOpen(false);
              router.push(`/sign-in`);
            }}
            onClose={() => setModalOpen(false)}
          />
        )}
      </main>
    </>
  );
}
