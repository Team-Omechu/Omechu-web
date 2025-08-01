"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchRestaurants } from "../api/myActivity";

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

import initialRestaurantData from "./edit/[id]/INITIAL_RESTAURANT_DATA";
import { MOCK_FOOD_REVIEW_CARD_DATA } from "./MOCK_FOOD_REVIEW_CARD_DATA";

type MyRestaurant = {
  id: number;
  name: string;
  repre_menu?: string;
  rating?: number;
  images?: { link: string }[];
  address?: string;
};

export default function MyActivity() {
  const router = useRouter();

  const [myRestaurants, setMyRestaurants] = useState<MyRestaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = "1";

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (selectedIndex !== 1) return; // 등록한 맛집 탭에서만

    setLoading(true);
    setError(null);

    fetchRestaurants(userId)
      .then((data) => {
        // data를 필요한 형태로 가공
        setMyRestaurants(
          data.results.map((item: any) => ({
            id: item.placeId,
            name: item.placeName,
            repre_menu: item.signatureMenu?.[0] ?? "",
            rating: item.placePoint,
            images: [{ link: item.placeImageUrl }],
            address: item.address,
            // ...필요에 따라 추가
          })),
        );
      })
      .catch(() => setError("맛집 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [selectedIndex]);

  const mainRef = useRef<HTMLDivElement>(null);

  const [sortOrder, setSortOrder] = useState<"recommended" | "latest">(
    "recommended",
  );
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredItems = Restaurants;

  const [reviewList, setReviewList] = useState(MOCK_FOOD_REVIEW_CARD_DATA);

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
    if (selectedIndex !== 0 && selectedIndex !== 1) return;

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px 160px 0px",
      threshold: 0,
    });

    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);

  const handleOpenEditModal = (id: number) => {
    setEditTargetId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditTargetId(null);
  };

  const editTargetData = initialRestaurantData.find(
    (r) => r.id === editTargetId,
  );

  const handleLikeToggle = (id: number) => {
    setReviewList((prev) =>
      prev.map((review) =>
        review.id === id
          ? {
              ...review,
              isLiked: !review.isLiked,
              recommendCount: review.isLiked
                ? (review.recommendCount ?? 1) - 1
                : (review.recommendCount ?? 0) + 1,
            }
          : review,
      ),
    );
  };

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
              height={22}
            />
          </Link>
        }
      />
      {/* 목록 정렬 탭 */}
      <SelectTabBar
        tabs={["후기", "등록한 맛집"]}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />

      <main
        ref={mainRef}
        className="flex h-screen w-full flex-col items-center overflow-auto px-2 pb-8 pt-3 scrollbar-hide"
      >
        {selectedIndex === 0 && (
          <>
            <section className="flex w-full justify-end gap-1 pb-3 pr-5 pt-1 text-sm text-grey-normalActive">
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
              {reviewList
                .slice()
                .sort((a, b) =>
                  sortOrder === "latest"
                    ? new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    : (b.recommendCount ?? 0) - (a.recommendCount ?? 0),
                )
                .slice(0, visibleCount)
                .map((review) => (
                  <FoodReviewCard
                    key={review.id}
                    {...review}
                    onLikeToggle={() => handleLikeToggle(review.id)}
                  />
                ))}
            </section>
          </>
        )}
        {selectedIndex === 1 && (
          <>
            {/* 등록한 맛집 목록 */}
            {/* <section className="flex flex-col gap-5 mt-4">
              {visibleItems.map((item, idx) => (
                <div key={item.id} className="flex flex-col">
                  <button
                    onClick={() => handleOpenEditModal(item.id)}
                    className="w-full pb-0.5 pr-1 text-end text-sm font-normal text-grey-normalActive"
                  >
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
            </section> */}
            {/* {editTargetData && (
              <RestaurantEditModal
                onClose={handleCloseEditModal}
                initialData={editTargetData}
              />
            )} */}

            <section>
              {loading && <div>로딩 중...</div>}
              {error && <div>{error}</div>}
              {!loading &&
                !error &&
                myRestaurants.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={{
                      id: item.id,
                      name: item.name,
                      menu: item.repre_menu || "",
                      rating: item.rating || 0,
                      images: item.images
                        ? item.images.map((img) => img.link)
                        : [],
                      // address 구조를 API 응답에 따라 맞춤 (예시: jibun/postalCode는 빈 값 처리)
                      address: {
                        road: item.address || "",
                        jibun: "",
                        postalCode: "",
                      },
                      tags: [], // 필요하면 추가
                      isLiked: false, // 필요하면 추가
                      reviews: 0, // 필요하면 추가
                      category: "", // 필요하면 추가
                      timetable: [], // 필요하면 추가
                    }}
                    onClick={() =>
                      router.push(`/restaurant/restaurant-detail/${item.id}`)
                    }
                  />
                ))}
              {!loading && !error && myRestaurants.length === 0 && (
                <div>등록한 맛집이 없습니다.</div>
              )}
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
