"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchMyPlaces, MyReviewItem } from "../api/myActivity";
import { fetchMyReviews } from "../api/myActivity";

import Image from "next/image";
import Link from "next/link";
import AuthErrorModal from "../AuthErrorModalSection";
import { useRouter } from "next/navigation";

import FloatingActionButton from "@/components/common/FloatingActionButton";
import FoodCard from "@/components/common/FoodCard";
import Header from "@/components/common/Header";
import FoodReviewCard from "@/components/common/RestaurantReviewCard";
import SortSelector from "@/components/common/SortSelector";
import SelectTabBar from "@/components/mypage/SelectTabBar";
import { Restaurants } from "@/constant/restaurant/restaurantList";

import initialRestaurantData from "./edit/[id]/INITIAL_RESTAURANT_DATA";
import { useAuthStore } from "@/auth/store";
import { likePlace, unlikePlace } from "../api/favorites";
import SkeletonFoodCard from "@/components/common/SkeletonFoodCard";
import SkeletonRestaurantReviewCard from "@/components/common/SkeletonRestaurantReviewCard";

type MyRestaurant = {
  id: number;
  name: string;
  repre_menu?: string;
  rating?: number;
  images?: { link: string }[];
  address?: string;
  reviews?: number;
};

export default function MyActivity() {
  const router = useRouter();
  // JWT 기반: 토큰 하이드레이션 후 유효성 체크
  const user = useAuthStore((s) => s.user);
  const accessToken = user?.accessToken;
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;
  const [modalOpen, setModalOpen] = useState(false);

  const [myRestaurants, setMyRestaurants] = useState<MyRestaurant[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [reviewList, setReviewList] = useState<MyReviewItem[]>([]);
  const [sortOrder, setSortOrder] = useState<"recommended" | "latest">(
    "recommended",
  );
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const LOADING_TIMEOUT = 1800;

  useEffect(() => {
    if (!hasHydrated) return; // 1) 스토어 복원 대기
    if (selectedIndex !== 0) return; // 2) 후기 탭일 때만

    // 3) 토큰 없으면 조용히 대기(모달 X). 목록만 비워두고 종료
    if (!accessToken) {
      setReviewList([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetchMyReviews()
      .then((res: any) => {
        if (!res.success || !Array.isArray(res.success.data)) {
          setReviewList([]);
          setError("리뷰 데이터를 불러오지 못했습니다.");
          return;
        }
        setReviewList(res.success.data);
        setModalOpen(false); // 성공하면 혹시 켜져있던 모달 닫기
      })
      .catch((e: any) => {
        if (e?.response?.status === 401) setModalOpen(true); // ← 여기서만 모달
        setError("리뷰 불러오기 실패");
      })
      .finally(() => setLoading(false));
  }, [hasHydrated, accessToken, selectedIndex]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (selectedIndex !== 1) return;

    if (!accessToken) {
      // 토큰 없으면 대기 (모달 X)
      setMyRestaurants([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetchMyPlaces(10, 10)
      .then((data: any) => {
        const places = data.success?.data ?? [];
        setMyRestaurants(
          places.map((item: any) => ({
            id: Number(item.id),
            name: item.name || "-",
            repre_menu:
              Array.isArray(item.repre_menu) && item.repre_menu.length > 0
                ? (item.repre_menu[0]?.menu ?? "")
                : "",
            rating: item.rating ?? 0,
            images: item.rest_image ? [{ link: item.rest_image }] : [],
            address: item.address ?? "",
            reviews: item._count?.review ?? 0,
          })),
        );
        setModalOpen(false); // 성공 시 모달 닫기
      })
      .catch((err: any) => {
        if (err?.response?.status === 401) setModalOpen(true); // ← 여기서만 모달
        setError("맛집 목록을 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, [hasHydrated, accessToken, selectedIndex]);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      if (!target.isIntersecting || isLoading) return;

      setIsLoading(true);

      if (selectedIndex === 0) {
        // 리뷰 탭
        setVisibleCount((prev) => Math.min(prev + 5, reviewList.length));
      } else if (selectedIndex === 1) {
        // 등록한 맛집 탭
        setVisibleCount((prev) => Math.min(prev + 5, myRestaurants.length));
      }
    },
    [isLoading, selectedIndex, reviewList.length, myRestaurants.length],
  );

  useEffect(() => {
    if (selectedIndex !== 0 && selectedIndex !== 1) return;

    if (
      (selectedIndex === 0 && visibleCount >= reviewList.length) ||
      (selectedIndex === 1 && visibleCount >= myRestaurants.length)
    ) {
      return;
    }

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
  }, [
    observerCallback,
    selectedIndex,
    visibleCount,
    reviewList.length,
    myRestaurants.length,
  ]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, LOADING_TIMEOUT); // 1.8초 후 로딩 해제

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

  const editTargetData = initialRestaurantData.find(
    (r) => r.id === editTargetId,
  );

  const handleLikeToggle = (id: number) => {
    setReviewList((prev) =>
      prev.map((review) =>
        review.id === id
          ? {
              ...review,
              isLiked: false,
              like: review.like
                ? (review.like ?? 1) - 1
                : (review.like ?? 0) + 1,
            }
          : review,
      ),
    );
  };

  const handleDeleteReview = (id: number) => {
    // TODO: 리뷰 삭제 기능 구현
  };

  const handleNavigateToRestaurant = (restaurantId?: string | number) => {
    if (!restaurantId) return;
    router.push(`/restaurant/restaurant-detail/${restaurantId}`);
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
            {/* 후기탭: 필터 */}
            <section className="flex w-full justify-end gap-1 pb-3 pr-5 pt-1 text-sm text-grey-normalActive">
              <SortSelector
                options={[
                  { label: "추천 순", value: "recommended" },
                  { label: "최신 순", value: "latest" },
                ]}
                selected={sortOrder}
                onSelect={(value) =>
                  setSortOrder(value === "latest" ? "latest" : "recommended")
                }
              />
            </section>

            {/* 로딩, 에러, 리스트 분기 */}
            {loading ? (
              <div className="flex flex-col gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRestaurantReviewCard key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <section className="flex w-full flex-col items-center gap-7">
                {reviewList.length === 0 ? (
                  <div className="text-grey-normalActive">
                    작성한 후기가 없습니다.
                  </div>
                ) : (
                  <>
                    {reviewList
                      .slice()
                      .sort((a, b) =>
                        sortOrder === "latest"
                          ? new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                          : (b.like ?? 0) - (a.like ?? 0),
                      )
                      .slice(0, visibleCount)
                      .map((review) => (
                        <FoodReviewCard
                          key={review.id}
                          id={Number(review.id)}
                          createdAt={review.created_at}
                          restaurantName={review.restaurant?.name ?? "-"}
                          rating={review.rating ?? 0}
                          reviewText={review.text ?? ""}
                          recommendCount={review.like ?? 0}
                          isLiked={false}
                          onLikeToggle={() =>
                            handleLikeToggle(Number(review.id))
                          }
                          restaurantImage={review.restaurant?.rest_image ?? ""}
                          reviewImages={
                            Array.isArray(review.reviewImages)
                              ? review.reviewImages
                              : []
                          }
                          tags={
                            Array.isArray(review.tag) && review.tag.length > 0
                              ? review.tag
                              : []
                          }
                          onDelete={() => handleDeleteReview(Number(review.id))}
                          onNavigate={() =>
                            handleNavigateToRestaurant(
                              String(review.restaurant?.id),
                            )
                          }
                        />
                      ))}
                    {/* 무한스크롤 트리거 */}
                    {reviewList.length > visibleCount && (
                      <div ref={loaderRef} className="h-[1px]" />
                    )}
                  </>
                )}
              </section>
            )}
          </>
        )}

        {selectedIndex === 1 && (
          <>
            {/* 등록한 맛집 탭 */}
            {loading ? (
              <div className="flex w-full flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonFoodCard key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <section className="flex w-full flex-col gap-5 px-2">
                {myRestaurants.length === 0 ? (
                  <div>등록한 맛집이 없습니다.</div>
                ) : (
                  <>
                    {myRestaurants.slice(0, visibleCount).map((item) => (
                      <div key={item.id} className="flex w-full flex-col">
                        <span className="w-full pr-2 text-end text-xs text-grey-normalActive">
                          편집
                        </span>
                        <FoodCard
                          onLike={async () => {
                            await likePlace(item?.id);
                            setMyRestaurants((prev) =>
                              prev.map((r) =>
                                r.id === item.id ? { ...r, isLiked: true } : r,
                              ),
                            );
                          }}
                          onUnlike={async () => {
                            await unlikePlace(item?.id);
                            setMyRestaurants((prev) =>
                              prev.map((r) =>
                                r.id === item.id ? { ...r, isLiked: false } : r,
                              ),
                            );
                          }}
                          item={{
                            id: item.id,
                            name: item.name,
                            menu: item.repre_menu || "",
                            rating: item.rating || 0,
                            images: item.images
                              ? item.images.map((img) => img.link ?? "")
                              : [],
                            address: {
                              road: item.address || "",
                              jibun: "",
                              postalCode: "",
                            },
                            tags: [],
                            isLiked: false,
                            reviews: 0,
                            category: "",
                            timetable: [],
                          }}
                          onClick={() =>
                            router.push(
                              `/restaurant/restaurant-detail/${item.id}`,
                            )
                          }
                        />
                      </div>
                    ))}
                    {/* 무한스크롤 트리거 */}
                    {myRestaurants.length > visibleCount && (
                      <div ref={loaderRef} className="h-[1px]" />
                    )}
                  </>
                )}
              </section>
            )}
          </>
        )}
        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />
      </main>
      {modalOpen && (
        <AuthErrorModal
          onConfirm={() => {
            setModalOpen(false);
            router.push("/sign-in");
          }}
          onClose={() => {
            setModalOpen(false);
            router.push("/sign-in");
          }}
        />
      )}
    </>
  );
}
