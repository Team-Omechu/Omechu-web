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
import LoadingIndicator from "@/components/common/LoadingIndicator";
import FoodReviewCard from "@/components/common/RestaurantReviewCard";
import SortSelector from "@/components/common/SortSelector";
import SelectTabBar from "@/components/mypage/SelectTabBar";
import { Restaurants } from "@/constant/restaurant/restaurantList";

import initialRestaurantData from "./edit/[id]/INITIAL_RESTAURANT_DATA";
import { MOCK_FOOD_REVIEW_CARD_DATA } from "./MOCK_FOOD_REVIEW_CARD_DATA";
import { useProfile } from "../hooks/useProfile";
import { likePlace, unlikePlace } from "../api/favorites";

type MyRestaurant = {
  id: number;
  name: string;
  repre_menu?: string;
  rating?: number;
  images?: { link: string }[];
  address?: string;
};

export default function MyActivity() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useProfile();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // 401 인증 오류로 추정되는 케이스 (필요에 따라 조건 조정)
    if (!profileLoading && profileError) {
      setModalOpen(true);
    }
  }, [profileLoading, profileError]);

  const [minLoading, setMinLoading] = useState(true);

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

  const filteredItems = Restaurants;

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const LODAING_TIMEOUT = 1800;

  useEffect(() => {
    if (selectedIndex !== 0) return;
    if (!profile?.id) return; // id 없으면 fetch 금지!

    setLoading(true);
    setError(null);

    fetchMyReviews(profile.id)
      .then((res) => {
        // 타입, 데이터 체크
        if (!res.success || !Array.isArray(res.success.data)) {
          setReviewList([]);
          setError("리뷰 데이터를 불러오지 못했습니다.");
          return;
        }
        setReviewList(res.success.data);
      })
      .catch(() => setError("리뷰 불러오기 실패"))
      .finally(() => setLoading(false));
  }, [selectedIndex, profile?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedIndex !== 1) return;
    if (!profile?.id) return;

    setLoading(true);
    setError(null);

    fetchMyPlaces(10, 10)
      .then((data: any) => {
        console.log("[DEBUG] fetchMyPlaces 응답 데이터:", data);
        const places = data.success?.data ?? [];
        setMyRestaurants(
          (data.success?.data ?? []).map((item: any) => ({
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
        console.log("[DEBUG] 상태에 세팅된 myRestaurants:", places);
      })
      .catch((err) => {
        console.error("[ERROR] fetchMyPlaces 실패:", err);
        setError("맛집 목록을 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, [selectedIndex, profile?.id]);

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

  if (!mounted) {
    return null;
  }

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
        className="flex flex-col items-center w-full h-screen px-2 pt-3 pb-8 overflow-auto scrollbar-hide"
      >
        {selectedIndex === 0 && (
          <>
            <section className="flex justify-end w-full gap-1 pt-1 pb-3 pr-5 text-sm text-grey-normalActive">
              {/* 필터 - 추천 순 | 최신 순 */}
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

            {loading && <div>로딩 중...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading && !error && (
              <section className="flex flex-col items-center gap-7">
                {reviewList.length === 0 ? (
                  <div className="text-grey-normalActive">
                    작성한 후기가 없습니다.
                  </div>
                ) : (
                  reviewList
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
                        isLiked={false} // 서버에 없으면 false
                        onLikeToggle={() => handleLikeToggle(Number(review.id))}
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
                    ))
                )}
              </section>
            )}
          </>
        )}
        {selectedIndex === 1 && (
          <section className="flex flex-col gap-5 px-2">
            {loading && <div>로딩 중...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading &&
              !error &&
              (myRestaurants.length > 0 ? (
                myRestaurants.map((item) => (
                  <div key={item.id} className="flex flex-col w-full">
                    <span className="w-full pr-2 text-xs text-end text-grey-normalActive">
                      편집
                    </span>
                    <FoodCard
                      onLike={async () => {
                        await likePlace(profile?.id, item.id);
                        setMyRestaurants((prev) =>
                          prev.map((r) =>
                            r.id === item.id ? { ...r, isLiked: true } : r,
                          ),
                        );
                      }}
                      onUnlike={async () => {
                        await unlikePlace(profile?.id, item.id);
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
                        router.push(`/restaurant/restaurant-detail/${item.id}`)
                      }
                    />
                  </div>
                ))
              ) : (
                <div>등록한 맛집이 없습니다.</div>
              ))}
          </section>
        )}

        <div ref={loaderRef} className="h-[1px]" />

        {isLoading && <LoadingIndicator />}
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
